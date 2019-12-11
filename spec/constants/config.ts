import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * TEST constants
 * 
 * @class TestConfig
 */

export class TestConfig {
    public static readonly app_id_openbanking: string = '3f12a5c0-f719-4c14-9eac-08ed99290109';
    public static readonly app_secret_openbanking: string = '93ea0128-8258-4b1d-9109-b4899a98677b';
    public static readonly app_redirect_uri: string = 'https://www.fintecture.com';
    public static readonly app_id_merchant: string = '1b96c253-1944-4986-a467-df2152ddffdb';
    public static readonly app_secret_merchant: string = 'f03fec5f-4d38-437f-914d-817337550fab';
    public static readonly app_priv_key_merchant: string = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeEocGuXp9AA+H
/8o2exRRkCsU49h8COUuCtjHJgEL4Wz9mKb1tZ7w9yzBYZ+vyOSMbMFocvIHZQac
up1cYX6+5J/XcH8QDJRqfq/dr//3xMwYH+xFBVL8R6C6Hoie3sow4x1k+ihOIZ+Q
MOoDTR+dSPnWrYjzKLa6rESJHlBrzQ5Qgq8KnwmiInkTMZq1fyOY0fBTdJuikr7/
xEnQBl44P/gqQzEeiS6kOswoXVn5DhQUSyQSMfTmrhuswnc/Ud5faBbQz1ZegsNc
eY6S6/b89lI4vcj6SCubuDWUEIVongvijF14p/y/UIU0y1JtQsK/5tmtSNboCnNN
kuKA079zAgMBAAECggEAI14i3xLOALzsPLIzROhZ/fvjX8uxCuOUn64mnbx3nHhm
QgGPTcfC1ciAN46Hw7WPyYml5qBdXeExTw0EG4Dm8oBF8VbG30jpRkCtSc1Q2Nes
ELPH0hOkYzUFlc8yI1XW6IRQdeDw9rZYNNN08KMncTI8UFfInhtccz0LIqDpPo0r
T/LVe3hN6tyW48VThMhTbf7vOGg1+fxABu8uoKFFq8bs/rp5b3Cu/8nfyNksEaTg
kz8z5dWTS0BCTMBPjgWMRXiRghWkYwQX84EVjapuPQnsEaH8zKOemITviBlO6wfh
iD2wyVwNfLTwaBiixzxh3uZGti0wq4Hg0g/31MAWDQKBgQDRlH+Mr+5zzIuSBOKj
MvIqNli9W2n7yKzpGjQTTG4V2EOwE2vxY3fbB4oxNVRNa4B44YM19P7B7gwLiWnO
eEuC95pS+vYNcYvCUyAxBEBlBTKKV7VMuavPjNkLgQH9F4Dj/reKsXcqbOzxR/5n
VjNYgaNWXb4fUYNrqyUuWV0bTQKBgQDBFXdSC4maU7MRMahkWhf/70S0917c4csx
pUut43gMpjFBDQMnXERXQudqFGPlEvzs5HMLl373SMZHiHr8WDcRwdtHMGTJOVqj
pD0XONzkP9jrwUIOKrF65VIFj005maFpAeHG5ZakIZ7WjdXQxh7j06SqoK5caJOK
rXl/qXNlvwKBgHc5RP4hr0LM37Enek5g0wZUeFLwR/BmDodk0q8P0ag3qPnncoaV
kT9WoLSxo82PFDyv/Vaakrp70vpVJ42/PSW5+V6vSX4IU/suEqgPxRoyxLeSgZ6u
GSEu/OHgd+Mklbwd0QfjQOkvofL4g68BiKAWz3Z4SYnDc0Gy0Kn3SFIZAoGBAIuk
oMVfvsc0nZ9j0KuzVQQu4fwXpC4Px0tChvdeOia704d+h7dhzbNmmcNot86m6vHR
Tzsk+BiUM4LsvDXg/wMCtzpHT70Qk/MiB2TSJT+WxaXMAaAJVI7TZ3zJ5UoxSEGP
sOCOj2JpRl1Z+zeg8hpHqSIWT8RZhcuYJvUjcmg1AoGADluBhTWky1K+QwmQE0DO
OHkL0TyG6qQ/31nnuLW5Ej1xQtuElQVWj/KZK5AJrusXSUEUzqPMR7MvMSclURyV
Mqo3BZADRlcr0AKP2TYSBCNcEBmBHCI9GfIRCPFR1eK+IciRyqjcz7kYlZ0YyfjF
r3xIiGe3JhVHqyTRE+maKu0=
-----END PRIVATE KEY-----`;
    public static readonly app_pub_key_merchant: string = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnhKHBrl6fQAPh//KNnsU
UZArFOPYfAjlLgrYxyYBC+Fs/Zim9bWe8PcswWGfr8jkjGzBaHLyB2UGnLqdXGF+
vuSf13B/EAyUan6v3a//98TMGB/sRQVS/Eeguh6Int7KMOMdZPooTiGfkDDqA00f
nUj51q2I8yi2uqxEiR5Qa80OUIKvCp8JoiJ5EzGatX8jmNHwU3SbopK+/8RJ0AZe
OD/4KkMxHokupDrMKF1Z+Q4UFEskEjH05q4brMJ3P1HeX2gW0M9WXoLDXHmOkuv2
/PZSOL3I+kgrm7g1lBCFaJ4L4oxdeKf8v1CFNMtSbULCv+bZrUjW6ApzTZLigNO/
cwIDAQAB
-----END PUBLIC KEY-----`;
}