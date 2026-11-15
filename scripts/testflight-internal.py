# App Store Connect API: iç test grubunu hazırlar, hesap kullanıcılarını ekler, build durumunu yazar.
import os, time, json, jwt, requests
KID=os.environ['ASC_KEY_ID']; ISS=os.environ['ASC_ISSUER_ID']; KEY=open(os.environ['ASC_KEY_PATH']).read()
BUNDLE='com.sonduduk.hakem'; API='https://api.appstoreconnect.apple.com/v1'
def tok(): return jwt.encode({'iss':ISS,'iat':int(time.time()),'exp':int(time.time())+1100,'aud':'appstoreconnect-v1'},KEY,algorithm='ES256',headers={'kid':KID,'typ':'JWT'})
def call(m,path,body=None,params=None):
    r=requests.request(m,API+path,headers={'Authorization':'Bearer '+tok(),'Content-Type':'application/json'},json=body,params=params)
    if r.status_code>=400: print('HTTP',r.status_code,m,path,r.text[:600])
    return r.json() if r.text else {}
app=call('GET','/apps',params={'filter[bundleId]':BUNDLE})['data'][0]; aid=app['id']; print('app',aid)
groups=call('GET',f'/apps/{aid}/betaGroups')['data']
print('groups',[(g['attributes']['name'],g['attributes']['isInternalGroup'],g['attributes'].get('hasAccessToAllBuilds')) for g in groups])
g=next((g for g in groups if g['attributes']['isInternalGroup']),None)
if not g:
    g=call('POST','/betaGroups',{'data':{'type':'betaGroups','attributes':{'name':'Ekip','isInternalGroup':True,'hasAccessToAllBuilds':True},'relationships':{'app':{'data':{'type':'apps','id':aid}}}}})['data']
    print('created group',g['id'])
gid=g['id']
users=call('GET','/users',params={'limit':50}).get('data',[])
have={t['attributes']['email'].lower() for t in call('GET',f'/betaGroups/{gid}/betaTesters',params={'limit':200}).get('data',[]) if t['attributes'].get('email')}
for u in users:
    a=u['attributes']; em=a['username']; print('user',em,a.get('roles'))
    if em.lower() in have: print(' already tester'); continue
    call('POST','/betaTesters',{'data':{'type':'betaTesters','attributes':{'email':em,'firstName':a.get('firstName'),'lastName':a.get('lastName')},'relationships':{'betaGroups':{'data':[{'type':'betaGroups','id':gid}]}}}})
    print(' added')
for i in range(40):
    b=call('GET','/builds',params={'filter[app]':aid,'sort':'-uploadedDate','limit':3,'include':'preReleaseVersion'})
    vers={x['id']:x['attributes']['version'] for x in b.get('included',[])}
    rows=[(vers.get(x['relationships']['preReleaseVersion']['data']['id']),x['attributes']['version'],x['attributes']['processingState']) for x in b['data']]
    print('builds',rows)
    top=b['data'][0]
    if top['attributes']['version']=='8' and top['attributes']['processingState']!='PROCESSING':
        bid=top['id']
        call('POST',f'/betaGroups/{gid}/relationships/builds',{'data':[{'type':'builds','id':bid}]})
        d=call('GET',f'/builds/{bid}/buildBetaDetail')
        print('beta detail',json.dumps(d.get('data',{}).get('attributes'))); break
    time.sleep(45)
