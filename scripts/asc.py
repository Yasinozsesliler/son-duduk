# App Store Connect API yardımcıları: python3 scripts/asc.py status | release_pending
import os, sys, time, json, jwt, requests
KID=os.environ['ASC_KEY_ID']; ISS=os.environ['ASC_ISSUER_ID']; KEY=open(os.environ['ASC_KEY_PATH']).read()
API='https://api.appstoreconnect.apple.com/v1'
def tok(): return jwt.encode({'iss':ISS,'iat':int(time.time()),'exp':int(time.time())+1100,'aud':'appstoreconnect-v1'},KEY,algorithm='ES256',headers={'kid':KID,'typ':'JWT'})
def call(m,path,body=None,params=None):
    r=requests.request(m,API+path,headers={'Authorization':'Bearer '+tok(),'Content-Type':'application/json'},json=body,params=params)
    if r.status_code>=400: print('HTTP',r.status_code,m,path,r.text[:800])
    return r.json() if r.text else {}
app=call('GET','/apps',params={'filter[bundleId]':'com.sonduduk.hakem'})['data'][0]; aid=app['id']
vers=call('GET',f'/apps/{aid}/appStoreVersions',params={'limit':10})['data']
for v in vers: print('version',v['attributes']['versionString'],v['attributes']['appStoreState'],v['attributes'].get('releaseType'))
b=call('GET','/builds',params={'filter[app]':aid,'sort':'-uploadedDate','limit':4,'include':'preReleaseVersion'})
vm={x['id']:x['attributes']['version'] for x in b.get('included',[])}
for x in b.get('data',[]): print('build',vm.get(x['relationships']['preReleaseVersion']['data']['id']),x['attributes']['version'],x['attributes']['processingState'])
cmd=sys.argv[1] if len(sys.argv)>1 else 'status'
if cmd=='release_pending':
    p=[v for v in vers if v['attributes']['appStoreState']=='PENDING_DEVELOPER_RELEASE']
    if not p: print('No version pending developer release'); sys.exit(0)
    r=call('POST','/appStoreVersionReleaseRequests',{'data':{'type':'appStoreVersionReleaseRequests','relationships':{'appStoreVersion':{'data':{'type':'appStoreVersions','id':p[0]['id']}}}}})
    print('release request', json.dumps(r)[:300])
    time.sleep(5)
    for v in call('GET',f'/apps/{aid}/appStoreVersions',params={'limit':10})['data']: print('now',v['attributes']['versionString'],v['attributes']['appStoreState'])
if cmd=='submit':
    ver=sys.argv[2] if len(sys.argv)>2 else None
    v=[x for x in vers if x['attributes']['versionString']==ver][0]; vid=v['id']
    want=sys.argv[3] if len(sys.argv)>3 and sys.argv[3] else None
    if want:
        for i in range(40):
            bl=call('GET','/builds',params={'filter[app]':aid,'filter[version]':want,'filter[preReleaseVersion.version]':ver}).get('data',[])
            if bl and bl[0]['attributes']['processingState']=='VALID': break
            print('waiting for build',want,bl and bl[0]['attributes']['processingState']); time.sleep(30)
        call('PATCH',f'/appStoreVersions/{vid}/relationships/build',{'data':{'type':'builds','id':bl[0]['id']}}); print('attached build',want)
    # ekran görüntüleri işlenene kadar bekle
    for i in range(30):
        locs=call('GET',f'/appStoreVersions/{vid}/appStoreVersionLocalizations')['data']
        pending=0; bad=0
        for L in locs:
            for ss in call('GET',f"/appStoreVersionLocalizations/{L['id']}/appScreenshotSets")['data']:
                for sh in call('GET',f"/appScreenshotSets/{ss['id']}/appScreenshots",params={'limit':50})['data']:
                    st=(sh['attributes'].get('assetDeliveryState') or {}).get('state')
                    if st in ('AWAITING_UPLOAD','UPLOAD_COMPLETE'): pending+=1
                    if st=='FAILED': bad+=1
        print('screenshots pending',pending,'failed',bad)
        if pending==0: break
        time.sleep(20)
    subs=call('GET','/reviewSubmissions',params={'filter[app]':aid,'filter[state]':'READY_FOR_REVIEW'}).get('data',[])
    sid=subs[0]['id'] if subs else call('POST','/reviewSubmissions',{'data':{'type':'reviewSubmissions','attributes':{'platform':'IOS'},'relationships':{'app':{'data':{'type':'apps','id':aid}}}}})['data']['id']
    items=call('GET',f'/reviewSubmissions/{sid}/items').get('data',[])
    if not items:
        r=call('POST','/reviewSubmissionItems',{'data':{'type':'reviewSubmissionItems','relationships':{'reviewSubmission':{'data':{'type':'reviewSubmissions','id':sid}},'appStoreVersion':{'data':{'type':'appStoreVersions','id':vid}}}}})
        print('item',json.dumps(r)[:1500])
    r=call('PATCH',f'/reviewSubmissions/{sid}',{'data':{'type':'reviewSubmissions','id':sid,'attributes':{'submitted':True}}})
    print('submitted', json.dumps(r.get('data',{}).get('attributes',{})))
