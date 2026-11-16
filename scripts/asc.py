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
