# BILDR Keretszerződés — Szekciók áttekintése

Egy tipikus BILDR Vállalkozási Keretszerződés szekciói. Minden új keretszerződés ezt a struktúrát követi.

## Fejléc

- **Cím:** VÁLLALKOZÁSI KERETSZERZŐDÉS
- **Felek bemutatása:**
  - Megrendelő (cégnév, székhely, adószám, cégjegyzékszám, képviselő)
  - Vállalkozó (BILDR HUB Kft. — fix adatok)
  - "Felek" / "Fél" definíció

## Szekciók

### 1. A Szerződés tárgya
- Mellékletben (Munkalap) meghatározott eredménytermékek megvalósítása
- Munkalap: feladatok, határidők, díj, erőforrások

### 2. Vállalkozó kötelezettségei
- Tevékenység gondossága, határidőre teljesítés
- Értesítési kötelezettség
- Megrendelő ellenőrzési joga

### 3. Megrendelő kötelezettségei
- Információk, dokumentumok átadása
- Adatok valódiságáért szavatolás

### 4. Vállalkozói Díj, Pénzügyi elszámolás
- Munkalap rögzíti a díjat
- Teljesítési igazolás (TIG) → számla kibocsátás alapja
- Mennyiségi átadás → 5 munkanapos átvizsgálás → TIG
- Számla fizetés: 8 munkanap

### 5. Titoktartás
- Minden olyan információt, amely a másik félre hátrányos
- 3 év a megszűnés után

### 6. Felhasználói jogok
- Kizárólagos felhasználási engedély a Munkákra
- Előzetes Szellemi Tulajdon (Vállalkozó megtartja)
- Referencia hivatkozás megengedett

### 7. Vállalkozó nyilatkozatai
- Nem sért más szerződést
- Nincs ellene per/csőd

### 8. Közreműködők alkalmazása
- Alvállalkozók, AI eszközök használata megengedett
- Vállalkozó felel értük

### 9. Kapcsolattartás
- Megrendelő kapcsolattartója (név, tel, email)
- Vállalkozó kapcsolattartója

### 10. Vis maior
- Természeti katasztrófa, háború, blokád stb.
- 30 napon túli késedelem → elállási jog

### 11. Szerződés hatálya és megszűnése
- Hatálybalépés: utolsó aláírás napja
- Határozatlan idő
- Súlyos szerződésszegés → azonnali felmondás
- 30 napos rendes felmondás indok nélkül

### 12. Munkalap hatályának megszűnése
- Feladatok teljesítésével és díj megfizetésével
- Új Munkalap kitöltésével módosítható

### 13. Felelősségkorlátozás
- Munkalap szerinti díj nettó összegéig
- Nem felel: elmaradt haszonért, üzleti lehetőségért, adatvesztésért
- Kivétel: szándékos károkozás, súlyos gondatlanság, titoktartás-megsértés

### 14. Záró és egyéb rendelkezések
- Részleges érvénytelenség
- Jogvita: Vállalkozó székhelye szerinti rendes bíróság
- Magyar jog, Ptk.
- Csak írásban módosítható
- GDPR megfelelés

### Aláírás
- Hely + dátum (pl. "Budapest, 2026. április ...")
- 2 eredeti példány

### 1. számú melléklet — 1. sz. MUNKALAP
A bázis template tartalmaz egy MUNKALAP mintát. Ezt **a `bildr-contractpage` skill cseréli le** a tényleges projekt-specifikus munkalapra. A keretszerződés DOCX-ből generálás után a melléklet rész **opcionálisan eltávolítható**, ha a munkalap külön dokumentumban készül.

## Kicserélendő placeholderek

A `scripts/generate_contract.py` `BASE_REPLACEMENTS` dict-je ezeket cseréli (ezek a string-ek a bázis DOCX-ben szerepelnek példa Megrendelő adatként, és cserélődnek a tényleges Megrendelő adataira):

| Eredeti (bázis template-ben) | Cserélődik (JSON config alapján) |
|---|---|
| Példa Ügyfél Korlátolt Felelősségű Társaság | {company_long_name} |
| Példa Ügyfél Kft. | {company_name} |
| 1051 Budapest, Példa utca 1. | {address} |
| 12345678-2-43 | {tax_id} |
| 01-09-123456 | {company_reg} |
| Példa Béla, ügyvezető | {representative_name}, {representative_role} |
| Példa Anna | {contact_name} |
| +36 1 234 5678 | {contact_phone} |
| kapcsolat@peldaugyfel.hu | {contact_email} |
| Példa Ügyfél marketing weboldal... | {project_title} |
| peldaugyfel.hu | {client_domain} |
| Budapest, 2026. április | {city}, {year}. {month} |

**Fontos:** A `BASE_REPLACEMENTS` dict bal oldali oszlopát kell a saját bázis DOCX-edben szereplő string-ekre igazítani. A jobb oldali placeholder-eket (`{company_name}` stb.) ne módosítsd — ezek a JSON config kulcsait használják.

## A BILDR HUB Kft. adatok érintetlenek

A Vállalkozó adatai a bázis template-ben már a BILDR HUB Kft.-re voltak állítva, ezeket **nem szabad cserélni**:

```
BILDR HUB Korlátolt Felelősségű Társaság
1052 Budapest, Károly körút 10. 2. em. 3B. ajtó
Adószám: 33011387-2-41
Cégjegyzékszám: 01-09-454292
Képviseli: Kovács Bence, ügyvezető
```

Ha a saját céges adataidat szeretnéd Vállalkozóként használni, írd át a bázis DOCX-ben.
