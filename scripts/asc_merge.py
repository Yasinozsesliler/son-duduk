# Onaylı bekleyen sürümü (PENDING_DEVELOPER_RELEASE) geri çekip yeni sürüm numarası ve derlemeyle yeniden kullanır.
# python3 scripts/asc_merge.py <yeni_surum> <build_no>     örn: 1.7.0 26
import os, sys, time, json, jwt, requests
KID=os.environ['ASC_KEY_ID']; ISS=os.environ['ASC_ISSUER_ID']; KEY=open(os.environ['ASC_KEY_PATH']).read()
API='https://api.appstoreconnect.apple.com/v1'
def tok(): return jwt.encode({'iss':ISS,'iat':int(time.time()),'exp':int(time.time())+1100,'aud':'appstoreconnect-v1'},KEY,algorithm='ES256',headers={'kid':KID,'typ':'JWT'})
def call(m,path,body=None,params=None):
    r=requests.request(m,API+path,headers={'Authorization':'Bearer '+tok(),'Content-Type':'application/json'},json=body,params=params)
    print('->',m,path,r.status_code, '' if r.status_code<400 else r.text[:600])
    return (r.json() if r.text else {}), r.status_code
new_ver=sys.argv[1]; build_no=sys.argv[2] if len(sys.argv)>2 else ''
aid=call('GET','/apps',params={'filter[bundleId]':'com.sonduduk.hakem'})[0]['data'][0]['id']
def versions(): return call('GET',f'/apps/{aid}/appStoreVersions',params={'limit':10})[0]['data']
vs=versions(); [print('version',v['attributes']['versionString'],v['attributes']['appStoreState']) for v in vs]
if any(v['attributes']['versionString']==new_ver for v in vs):
    print('Version',new_ver,'already exists; nothing to rename.'); target=[v for v in vs if v['attributes']['versionString']==new_ver][0]
else:
    pend=[v for v in vs if v['attributes']['appStoreState'] in ('PENDING_DEVELOPER_RELEASE','DEVELOPER_REJECTED','PREPARE_FOR_SUBMISSION','REJECTED','METADATA_REJECTED')]
    if not pend: print('No editable or pending version found'); sys.exit(1)
    target=pend[0]; vid=target['id']; st=target['attributes']['appStoreState']; print('target',target['attributes']['versionString'],st)
    if st=='PENDING_DEVELOPER_RELEASE':
        # Geliştirici reddi: sürümün inceleme gönderimini iptal etmeyi dener
        sub,code=call('GET',f'/appStoreVersions/{vid}/appStoreVersionSubmission')
        if code<400 and sub.get('data'): call('DELETE',f"/appStoreVersionSubmissions/{sub['data']['id']}")
        time.sleep(5); target=[v for v in versions() if v['id']==vid][0]; st=target['attributes']['appStoreState']; print('state now',st)
        if st=='PENDING_DEVELOPER_RELEASE':
            print('RESULT: API could not developer-reject. Reject it in App Store Connect (version page > "Reject this version"), then run this task again.'); sys.exit(2)
    _,code=call('PATCH',f'/appStoreVersions/{vid}',{'data':{'type':'appStoreVersions','id':vid,'attributes':{'versionString':new_ver}}})
    if code>=400: print('RESULT: could not rename version'); sys.exit(3)
if build_no:
    vid=target['id']
    for i in range(40):
        bl=call('GET','/builds',params={'filter[app]':aid,'filter[version]':build_no,'filter[preReleaseVersion.version]':new_ver})[0].get('data',[])
        if bl and bl[0]['attributes']['processingState']=='VALID': break
        print('waiting for build',build_no); time.sleep(30)
    call('PATCH',f'/appStoreVersions/{vid}/relationships/build',{'data':{'type':'builds','id':bl[0]['id']}}); print('attached build',build_no)
for v in versions(): print('now',v['attributes']['versionString'],v['attributes']['appStoreState'])
print('RESULT: ok')
