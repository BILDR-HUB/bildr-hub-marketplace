# bildr-contract — DOCX template setup

Ez a skill **nem tartalmaz bundled DOCX template-et** üzleti és adatvédelmi okból (egy mellékelt template céges és ügyfél-specifikus adatokat tartalmazna).

## Mit kell tenned

1. **Készíts saját bázis keretszerződés DOCX-et** — egy korábbi szerződésedből vagy nullról (Word/Pages).
2. **Cseréld ki benne a Megrendelő adatokat** generikus mintára:
   - Cégnév: `Példa Ügyfél Kft.` / `Példa Ügyfél Korlátolt Felelősségű Társaság`
   - Székhely: `1051 Budapest, Példa utca 1.`
   - Adószám: `12345678-2-43`
   - Cégjegyzékszám: `01-09-123456`
   - Képviselő: `Példa Béla, ügyvezető`
   - Kapcsolattartó: `Példa Anna`, `+36 1 234 5678`, `kapcsolat@peldaugyfel.hu`
   - Projekt: `Példa Ügyfél marketing weboldal fejlesztése`
   - Domain: `peldaugyfel.hu`
   - Aláírás: `Budapest, 2026. április`
3. **Hagyd meg a Vállalkozó (BILDR HUB Kft.) adatokat** úgy, ahogy van.
4. Mentsd a saját rendszereden, pl. `~/.bildr/templates/keretszerzodes-template.docx`.
5. **Add meg a `--template` argumentumon keresztül** a `generate_contract.py`-nak.

## Custom template használata

Ha a saját DOCX-edben más string-ek szerepelnek a Megrendelő placeholder-jeként (nem a fenti generikus minta), akkor a `scripts/generate_contract.py` `BASE_REPLACEMENTS` dict-jében kell **átírnod a bal oldali oszlopot** a saját string-eidre. A jobb oldali `{placeholder}`-eket ne módosítsd — ezek a JSON config kulcsait használják.

## Példa template használat

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/skills/bildr-contract/scripts/generate_contract.py \
  --template ~/.bildr/templates/keretszerzodes-template.docx \
  --config /tmp/bildr-contract-{slug}.json \
  --output <bildr-website-repo>/contracts/{slug}-keretszerzodes-{YYYY-MM-DD}.docx
```
