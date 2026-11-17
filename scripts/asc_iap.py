# App Store Connect: Refmania uygulama içi ürünlerini oluşturur ya da günceller (tekrar çalıştırmak güvenlidir).
# Hepsi tüketilmeyen (NON_CONSUMABLE). Fiyat: ABD taban fiyatı, diğer ülkeler App Store'un otomatik kur karşılığı (her yerde aynı fiyat).
import os, sys, time, json, hashlib, jwt, requests
KID=os.environ['ASC_KEY_ID']; ISS=os.environ['ASC_ISSUER_ID']; KEY=open(os.environ['ASC_KEY_PATH']).read()
B='https://api.appstoreconnect.apple.com'
def tok(): return jwt.encode({'iss':ISS,'iat':int(time.time()),'exp':int(time.time())+1100,'aud':'appstoreconnect-v1'},KEY,algorithm='ES256',headers={'kid':KID,'typ':'JWT'})
def call(m,path,body=None,params=None):
    r=requests.request(m,B+path,headers={'Authorization':'Bearer '+tok(),'Content-Type':'application/json'},json=body,params=params)
    if r.status_code>=400: print('HTTP',r.status_code,m,path,r.text[:900])
    return r.json() if r.text else {}
def all_pages(path,params=None):
    out=[]; p=dict(params or {}); p.setdefault('limit',200); url=path
    while url:
        r=call('GET',url,params=p if url==path else None); out+=r.get('data',[])
        nxt=r.get('links',{}).get('next'); url=nxt.replace(B,'') if nxt else None
    return out

REVIEW_SHOT=os.path.join(os.path.dirname(__file__),'..','store','iap_review.png')
NOTE=('Packs are one-time non-consumable purchases. Open Shop (Mağaza) > Packs (Paketler) or tap the crown row on Home. '
      'Premium removes interstitial ads and makes rewarded bonuses instant. The Complete Pack includes Premium plus cosmetic items. '
      'The Complete Pack Offer is the same content at a discount, shown only during limited-time windows. The Upgrade is offered only to Premium owners.')
PRODUCTS=[
 {'pid':'com.sonduduk.hakem.premium','ref':'Premium','usd':'3.99','loc':{
   'en-US':('Premium','Ad-free play, instant rewards, ₺250k'),
   'tr':('Premium','Reklamsız oyun, anında ödüller, 250 bin ₺'),
   'de-DE':('Premium','Werbefrei, Belohnungen sofort, 250k'),
   'es-ES':('Premium','Sin anuncios, premios al instante, 250k')}},
 {'pid':'com.sonduduk.hakem.tampaket','ref':'Complete Pack','usd':'5.99','loc':{
   'en-US':('Complete Pack','Premium + luxury items, gold kits, ₺750k'),
   'tr':('Tam Paket','Premium + lüks koleksiyon, altın formalar'),
   'de-DE':('Komplettpaket','Premium + Luxus, goldene Trikots, 750k'),
   'es-ES':('Pack Completo','Premium + lujo, uniformes dorados, 750k')}},
 {'pid':'com.sonduduk.hakem.firsat','ref':'Complete Pack Offer','usd':'2.99','loc':{
   'en-US':('Complete Pack Offer','Limited-time Complete Pack at half price'),
   'tr':('Tam Paket Fırsatı','Süreli fırsat: Tam Paket yarı fiyatına'),
   'de-DE':('Komplettpaket-Angebot','Komplettpaket zeitlich begrenzt, halber Preis'[:45]),
   'es-ES':('Oferta Pack Completo','Pack Completo a mitad de precio, por tiempo')}},
 {'pid':'com.sonduduk.hakem.yukseltme','ref':'Complete Pack Upgrade','usd':'2.99','loc':{
   'en-US':('Complete Pack Upgrade','Upgrade from Premium to the Complete Pack'),
   'tr':('Tam Paket Yükseltmesi','Premium’dan Tam Paket’e yükseltme'),
   'de-DE':('Upgrade Komplettpaket','Von Premium auf das Komplettpaket'),
   'es-ES':('Mejora a Pack Completo','De Premium al Pack Completo')}},
]

app=call('GET','/v1/apps',params={'filter[bundleId]':'com.sonduduk.hakem'})['data'][0]; aid=app['id']
existing={x['attributes']['productId']:x for x in all_pages(f'/v1/apps/{aid}/inAppPurchasesV2')}
territories=[t['id'] for t in all_pages('/v1/territories')]
print('territories',len(territories),'existing',list(existing))

def ensure(p):
    iap=existing.get(p['pid'])
    if not iap:
        r=call('POST','/v2/inAppPurchases',{'data':{'type':'inAppPurchases','attributes':{'name':p['ref'],'productId':p['pid'],'inAppPurchaseType':'NON_CONSUMABLE','reviewNote':NOTE,'familySharable':False},'relationships':{'app':{'data':{'type':'apps','id':aid}}}}})
        iap=r.get('data')
        if not iap: return
        print('created',p['pid'],iap['id'])
    else:
        call('PATCH',f"/v2/inAppPurchases/{iap['id']}",{'data':{'type':'inAppPurchases','id':iap['id'],'attributes':{'reviewNote':NOTE}}})
    iid=iap['id']
    # yerelleştirmeler
    have={l['attributes']['locale']:l for l in call('GET',f'/v2/inAppPurchases/{iid}/inAppPurchaseLocalizations').get('data',[])}
    for loc,(nm,ds) in p['loc'].items():
        nm=nm[:30]; ds=ds[:45]
        if loc in have:
            call('PATCH',f"/v1/inAppPurchaseLocalizations/{have[loc]['id']}",{'data':{'type':'inAppPurchaseLocalizations','id':have[loc]['id'],'attributes':{'name':nm,'description':ds}}})
        else:
            call('POST','/v1/inAppPurchaseLocalizations',{'data':{'type':'inAppPurchaseLocalizations','attributes':{'locale':loc,'name':nm,'description':ds},'relationships':{'inAppPurchaseV2':{'data':{'type':'inAppPurchases','id':iid}}}}})
    # fiyat (ABD taban; diğerleri otomatik kur karşılığı)
    pts=all_pages(f'/v2/inAppPurchases/{iid}/pricePoints',{'filter[territory]':'USA','limit':200})
    pt=[x for x in pts if x['attributes']['customerPrice']==p['usd']]
    if pt:
        r=call('POST','/v1/inAppPurchasePriceSchedules',{'data':{'type':'inAppPurchasePriceSchedules','relationships':{
            'inAppPurchase':{'data':{'type':'inAppPurchases','id':iid}},
            'baseTerritory':{'data':{'type':'territories','id':'USA'}},
            'manualPrices':{'data':[{'type':'inAppPurchasePrices','id':'${p0}'}]}}},
            'included':[{'type':'inAppPurchasePrices','id':'${p0}','attributes':{'startDate':None},'relationships':{'inAppPurchasePricePoint':{'data':{'type':'inAppPurchasePricePoints','id':pt[0]['id']}}}}]})
        print('price',p['usd'],'ok' if r.get('data') else 'err')
    else: print('price point not found',p['usd'])
    # bütün ülkelerde satışta
    r=call('POST','/v1/inAppPurchaseAvailabilities',{'data':{'type':'inAppPurchaseAvailabilities','attributes':{'availableInNewTerritories':True},'relationships':{
        'inAppPurchase':{'data':{'type':'inAppPurchases','id':iid}},
        'availableTerritories':{'data':[{'type':'territories','id':t} for t in territories]}}}})
    print('availability','ok' if r.get('data') else 'err')
    # inceleme ekran görüntüsü
    cur=call('GET',f'/v2/inAppPurchases/{iid}/appStoreReviewScreenshot').get('data')
    if not cur and os.path.exists(REVIEW_SHOT):
        data=open(REVIEW_SHOT,'rb').read()
        r=call('POST','/v1/inAppPurchaseAppStoreReviewScreenshots',{'data':{'type':'inAppPurchaseAppStoreReviewScreenshots','attributes':{'fileName':'iap_review.png','fileSize':len(data)},'relationships':{'inAppPurchaseV2':{'data':{'type':'inAppPurchases','id':iid}}}}})
        sh=r.get('data')
        if sh:
            for op in sh['attributes']['uploadOperations']:
                part=data[op['offset']:op['offset']+op['length']]
                requests.request(op['method'],op['url'],headers={h['name']:h['value'] for h in op['requestHeaders']},data=part)
            call('PATCH',f"/v1/inAppPurchaseAppStoreReviewScreenshots/{sh['id']}",{'data':{'type':'inAppPurchaseAppStoreReviewScreenshots','id':sh['id'],'attributes':{'uploaded':True,'sourceFileChecksum':hashlib.md5(data).hexdigest()}}})
            print('review screenshot uploaded')
    st=call('GET',f'/v2/inAppPurchases/{iid}').get('data',{}).get('attributes',{}).get('state')
    print('STATE',p['pid'],st)

if len(sys.argv)>1 and sys.argv[1]=='submit':
    # İlk ürünler sürümle birlikte incelenir: önce sürümü içeren taslak inceleme gönderimi hazırlanır.
    ver=sys.argv[2] if len(sys.argv)>2 else '1.2.0'; bnum=sys.argv[3] if len(sys.argv)>3 else ''
    v=[x for x in call('GET',f'/v1/apps/{aid}/appStoreVersions',params={'limit':10})['data'] if x['attributes']['versionString']==ver][0]; vid=v['id']
    if bnum:
        bl=call('GET','/v1/builds',params={'filter[app]':aid,'filter[version]':bnum,'filter[preReleaseVersion.version]':ver}).get('data',[])
        if bl: call('PATCH',f'/v1/appStoreVersions/{vid}/relationships/build',{'data':{'type':'builds','id':bl[0]['id']}}); print('build attached',bnum)
    subs=call('GET','/v1/reviewSubmissions',params={'filter[app]':aid,'filter[state]':'READY_FOR_REVIEW'}).get('data',[])
    sid=subs[0]['id'] if subs else call('POST','/v1/reviewSubmissions',{'data':{'type':'reviewSubmissions','attributes':{'platform':'IOS'},'relationships':{'app':{'data':{'type':'apps','id':aid}}}}})['data']['id']
    items=call('GET',f'/v1/reviewSubmissions/{sid}/items',params={'include':'appStoreVersion'}).get('data',[])
    print('draft items',[ (i.get('relationships',{}).get('appStoreVersion',{}).get('data') or {}).get('id') for i in items])
    if not any((i.get('relationships',{}).get('appStoreVersion',{}).get('data') or {}).get('id')==vid for i in items): print('item',json.dumps(call('POST','/v1/reviewSubmissionItems',{'data':{'type':'reviewSubmissionItems','relationships':{'reviewSubmission':{'data':{'type':'reviewSubmissions','id':sid}},'appStoreVersion':{'data':{'type':'appStoreVersions','id':vid}}}}}))[:300])
    print('draft submission',sid)
    for p in PRODUCTS:
        iap=existing.get(p['pid'])
        if not iap: print('missing',p['pid']); continue
        r=call('POST','/v1/inAppPurchaseSubmissions',{'data':{'type':'inAppPurchaseSubmissions','relationships':{'inAppPurchaseV2':{'data':{'type':'inAppPurchases','id':iap['id']}}}}})
        st=call('GET',f"/v2/inAppPurchases/{iap['id']}").get('data',{}).get('attributes',{}).get('state')
        print('SUBMIT',p['pid'],'ok' if r.get('data') else 'err',st)
else:
    for p in PRODUCTS: ensure(p)
