#!/usr/bin/env python3
"""Google Play mağaza dosyalarını App Store metinleri ve görsellerinden üretir.

Çıktı: fastlane/play/<dil>/ (fastlane supply biçimi)
  title.txt, short_description.txt, full_description.txt
  images/icon.png, images/featureGraphic.png, images/phoneScreenshots/, images/tenInchScreenshots/

Kullanım:  python3 scripts/play-store.py
(featureGraphic için önce: node scripts/play-feature.js)
"""
import os, re, shutil
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IOS = os.path.join(ROOT, 'fastlane', 'metadata')
OUT = os.path.join(ROOT, 'fastlane', 'play')
SHOTS = os.path.join(ROOT, 'store', 'screenshots')
FEAT = os.path.join(ROOT, 'store', 'play')

# Play dili -> (App Store metin klasörü, ekran görüntüsü dili)
LOCALES = {
    'tr-TR': ('tr', 'tr'),
    'en-US': ('en-US', 'en'),
    'en-GB': ('en-GB', 'en'),
    'de-DE': ('de-DE', 'de'),
    'es-ES': ('es-ES', 'es'),
    'es-419': ('es-MX', 'es'),
}
SHORT = {  # en fazla 80 karakter
    'tr': "Penaltı mı, değil mi? Düdük sende: VAR'lı futbol hakemi kariyer oyunu.",
    'en': "Penalty or not? You hold the whistle in this football referee career game.",
    'de': "Elfmeter oder nicht? Du hast die Pfeife: Fußball-Schiedsrichter-Karriere.",
    'es': "¿Penalti o no? El silbato es tuyo: juego de carrera de árbitro de fútbol.",
}
# Android sürümünde reklam yok; marka adları Play kurallarına göre genel ifadeyle
FIX = [
    ("Ücretsiz; isteğe bağlı reklam ve paketler var.", "Ücretsiz; isteğe bağlı paketler var."),
    ("Free, with optional ads and packs.", "Free, with optional packs."),
    ("Kostenlos, mit optionaler Werbung und Paketen.", "Kostenlos, mit optionalen Paketen."),
    ("Gratis, con anuncios y paquetes opcionales.", "Gratis, con paquetes opcionales."),
    ("Dünya Kupası finalini", "dünya finalini"),
    ("a World Cup final", "a world final"),
    ("das FIFA-Abzeichen und vielleicht eines Tages ein WM-Finale", "das internationale Abzeichen und vielleicht eines Tages ein Weltfinale"),
    ("una final del Mundial", "una final mundial"),
]
MAX_PHONE = 8


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text.strip() + '\n')


def png_rgb(src, dst, crop=None, size=None):
    im = Image.open(src).convert('RGB')
    if crop:
        im = im.crop(crop)
    if size:
        im = im.resize(size, Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, optimize=True)


def main():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    icon = os.path.join(ROOT, 'resources', 'icon-only.png')
    feat_any = False
    for play, (ios, shot) in LOCALES.items():
        base = os.path.join(OUT, play)
        title = open(os.path.join(IOS, ios, 'name.txt'), encoding='utf-8').read().strip()
        assert len(title) <= 30, (play, title)
        short = SHORT[shot]
        assert len(short) <= 80, (play, len(short))
        desc = open(os.path.join(IOS, ios, 'description.txt'), encoding='utf-8').read()
        for a, b in FIX:
            desc = desc.replace(a, b)
        assert len(desc) <= 4000
        write(os.path.join(base, 'title.txt'), title)
        write(os.path.join(base, 'short_description.txt'), short)
        write(os.path.join(base, 'full_description.txt'), desc)
        img = os.path.join(base, 'images')
        png_rgb(icon, os.path.join(img, 'icon.png'), size=(512, 512))
        feat = os.path.join(FEAT, f'feature_{shot}.png')
        if os.path.exists(feat):
            png_rgb(feat, os.path.join(img, 'featureGraphic.png'), size=(1024, 500))
            feat_any = True
        # Telefon: Play en/boy oranı en fazla 2:1 ister; 1290x2796 alttan 1290x2580'e kırpılır
        n = 0
        for i in range(1, 11):
            src = os.path.join(SHOTS, shot, f'iphone_{i}.png')
            if not os.path.exists(src) or n >= MAX_PHONE:
                continue
            n += 1
            w, h = Image.open(src).size
            png_rgb(src, os.path.join(img, 'phoneScreenshots', f'{n}.png'), crop=(0, 0, w, min(h, w * 2)))
        t = 0
        for i in range(1, 11):
            src = os.path.join(SHOTS, shot, f'ipad_{i}.png')
            if not os.path.exists(src) or t >= MAX_PHONE:
                continue
            t += 1
            png_rgb(src, os.path.join(img, 'tenInchScreenshots', f'{t}.png'))
        print(f'{play}: "{title}" | kısa {len(short)} | açıklama {len(desc)} | telefon {n} | tablet {t}')
    if not feat_any:
        print('UYARI: featureGraphic yok; önce node scripts/play-feature.js çalıştır')


if __name__ == '__main__':
    main()
