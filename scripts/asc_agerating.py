# Yaş derecelendirmesinde "Reklam" içeriğini Evet yapar ve sorunlu inceleme gönderimini yeniden gönderir.
import os, time, json, jwt, requests
KID=os.environ['ASC_KEY_ID']; ISS=os.environ['ASC_ISSUER_ID']; KEY=open(os.environ['ASC_KEY_PATH']).read()
B='https://api.appstoreconnect.apple.com'
def tok(): return jwt.encode({'iss':ISS,'iat':int(time.time()),'exp':int(time.time())+1100,'aud':'appstoreconnect-v1'},KEY,algorithm='ES256',headers={'kid':KID,'typ':'JWT'})
def call(m,path,body=None,params=None):
    r=requests.request(m,B+path,headers={'Authorization':'Bearer '+tok(),'Content-Type':'application/json'},json=body,params=params)
    if r.status_code>=400: print('HTTP',r.status_code,m,path,r.text[:900])
    return r.json() if r.text else {}
aid=call('GET','/v1/apps',params={'filter[bundleId]':'com.sonduduk.hakem'})['data'][0]['id']
for info in call('GET',f'/v1/apps/{aid}/appInfos')['data']:
    st=info['attributes'].get('appStoreState') or info['attributes'].get('state')
    ar=call('GET',f"/v1/appInfos/{info['id']}/ageRatingDeclaration").get('data')
    if not ar: continue
    print('appInfo',info['id'],st,'advertising=',ar['attributes'].get('advertising'))
    if st in ('READY_FOR_DISTRIBUTION','READY_FOR_SALE'): continue
    r=call('PATCH',f"/v1/ageRatingDeclarations/{ar['id']}",{'data':{'type':'ageRatingDeclarations','id':ar['id'],'attributes':{'advertising':True}}})
    print('patched advertising ->',r.get('data',{}).get('attributes',{}).get('advertising'))
for s in call('GET','/v1/reviewSubmissions',params={'filter[app]':aid,'limit':10})['data']:
    print('submission',s['id'],s['attributes'].get('state'))
    if s['attributes'].get('state')=='UNRESOLVED_ISSUES':
        r=call('PATCH',f"/v1/reviewSubmissions/{s['id']}",{'data':{'type':'reviewSubmissions','id':s['id'],'attributes':{'submitted':True}}})
        print('resubmitted ->',r.get('data',{}).get('attributes',{}).get('state'))
