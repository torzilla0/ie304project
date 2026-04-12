# 🧪 METU-IE Summer Practice RAG Chatbot — Test Raporu

**Tarih:** 9 Nisan 2026  
**Tester:** Otomatik Test (API + Tarayıcı)  
**Ortam:** `http://localhost:3000` — Next.js 16.2.3 (Turbopack)  
**LLM:** Gemini 2.5 Flash | **Embedding:** Gemini Embedding 001  
**Bilgi Tabanı:** 124 chunk (JSON + PDF + TXT + DOCX)

---

## 📊 Özet Sonuçlar

| Kategori | Sorgu Sayısı | ✅ Başarılı | ⚠️ Kısmi | ❌ Başarısız |
|----------|:-----------:|:----------:|:--------:|:----------:|
| **Bağlamsal Bütünlük** | 7 | 6 | 1 | 0 |
| **Kapsam Dışı Yönetimi** | 2 | 2 | 0 | 0 |
| **Çoklu Dil (Türkçe)** | 2 | 2 | 0 | 0 |
| **Eklenen Dosya Doğrulaması** | 1 | 1 | 0 | 0 |
| **TOPLAM** | **12** | **11** | **1** | **0** |

> **Genel Başarı Oranı: %91.7 (11/12 Tam Başarılı)**

---

## 🔬 Detaylı Test Sonuçları

### Test 1: IE 300 Ön Koşulları
| | |
|---|---|
| **Kategori** | Bağlamsal Bütünlük |
| **Sorgu** | _"What are the prerequisites for IE 300?"_ |
| **Durum** | ✅ **BAŞARILI** |

**Chatbot Yanıtı:**
> To conduct IE 300 Summer Practice, you must have completed the following prerequisites:
> - IE 102
> - IE 251, IE 265, IE 241, OHS 101 (these are fall semester courses)
> - One course from: IE 266 or IE 252 (this is a spring semester course)
>
> **Important Notes:**
> - ALL prerequisite courses must be completed with a grade of DD or higher.
> - If you are on academic probation in the Fall semester, you cannot register for the IE 300 course even if you completed your summer practice.

**Değerlendirme:** Tüm 5 ön koşul dersi doğru listelenmiş. DD notu gereksinimi ve akademik uyarı kısıtlaması da doğru belirtilmiş. ✅

---

### Test 2: Gerekli Belgeler
| | |
|---|---|
| **Kategori** | Bağlamsal Bütünlük |
| **Sorgu** | _"What documents do I need for summer practice?"_ |
| **Durum** | ✅ **BAŞARILI** |

**Chatbot Yanıtı:**
> You need the following documents for summer practice:
> 1. SP Application Letter (if required by the company)
> 2. SP Protocol Form/Contract (sözleşme, if required)
> 3. SGK Insurance Application via OCW
> 4. Declaration Form for health insurance
> 5. SP Evaluation Form (filled by your supervisor)
> 6. Employer Survey (filled by your supervisor)
> 7. Your final Summer Practice Report in PDF format
> 8. Paid SP Form and bank receipt if you received payment.

**Değerlendirme:** 8 belgenin tamamı doğru listelenmiş. Her birinin ne olduğu ve kimin tarafından doldurulacağı belirtilmiş. ✅

---

### Test 3: IE 300 Kabul Edilen Şirketler
| | |
|---|---|
| **Kategori** | Bağlamsal Bütünlük |
| **Sorgu** | _"What types of companies are accepted for IE 300?"_ |
| **Durum** | ✅ **BAŞARILI** |

**Chatbot Yanıtı:**
> For IE 300, only MANUFACTURING companies are accepted. The accepted types include:
> - **Manufacturing firms:** Automotive, Machine parts, Electronics, Furniture, Textiles, Consumer durables
> - **Batch process industries:** Steel, Paper mills, Pharmaceutical, Food and beverages

**Değerlendirme:** Sadece üretim şirketlerinin kabul edildiği doğru belirtilmiş. Kabul edilen türler doğru. ✅

---

### Test 4: SGK Sigortası Zamanlaması
| | |
|---|---|
| **Kategori** | Bağlamsal Bütünlük |
| **Sorgu** | _"When should I apply for SGK insurance?"_ |
| **Durum** | ✅ **BAŞARILI** |

**Chatbot Yanıtı:**
> You should apply for SGK insurance **2-3 weeks** before your internship start date. It is important to leave at least **one full week** safety margin between your application and the internship start date. Do not apply more than **2 months** early or fewer than **5 days** before your start date. Applications are processed **each Monday** for internships beginning within the following two weeks.

**Değerlendirme:** Başvuru zamanlaması (2-3 hafta), güvenlik marjı (1 hafta), minimum/maksimum (5 gün - 2 ay) ve Pazartesi işleme kuralı doğru. ✅

---

### Test 5: Yurt Dışı Staj
| | |
|---|---|
| **Kategori** | Bağlamsal Bütünlük |
| **Sorgu** | _"Can I do my internship abroad?"_ |
| **Durum** | ✅ **BAŞARILI** |

**Chatbot Yanıtı:**
> Yes, you can complete your internship abroad through the **Erasmus Student Internship** mobility program. The duration can be **3-12 months**. A short-term completion (3 months) counts as either **IE 300 or IE 400**, not both. Please check the Erasmus office website for details.

**Değerlendirme:** Erasmus programı, süre bilgisi (3-12 ay) ve kısıtlama (IE 300 veya IE 400, ikisi birden değil) doğru. ✅

---

### Test 6: Aynı Şirkette İki Öğrenci
| | |
|---|---|
| **Kategori** | Bağlamsal Bütünlük |
| **Sorgu** | _"Can two students do their internship at the same company?"_ |
| **Durum** | ✅ **BAŞARILI** |

**Chatbot Yanıtı:**
> Yes, multiple students can work at the same organization. However, each student must submit a **separate report**. Problem definitions **must differ** between students, though project parts may align for complex projects. A **maximum of two students** can work together on related parts.

**Değerlendirme:** Ayrı rapor gerekliliği, farklı problem tanımı zorunluluğu, maksimum 2 öğrenci bilgisi doğru. ✅

---

### Test 7: Ücretli Staj
| | |
|---|---|
| **Kategori** | Bağlamsal Bütünlük |
| **Sorgu** | _"How can I get paid during my internship?"_ |
| **Durum** | ⚠️ **KISMİ** |

**Chatbot Yanıtı:**
> I can only assist with METU-IE Summer Practice queries, and unfortunately, I do not have this specific information in my official guidelines. Please contact the SP Committee at ie-staj@metu.edu.tr or visit https://sp-ie.metu.edu.tr/en for the most up-to-date information.

**Değerlendirme:** Chatbot, bilgi tabanında "Paid Summer Practice" detayları mevcut olmasına rağmen bu bilgiyi sunamadı. İdeal olarak "Paid SP questionnaire'i OCW'den doldur, bank receipt yükle" gibi bilgi vermesi beklenirdi. Bu durum, embedding'lerin "get paid" sorgusunu "paid internship procedures" ile tam olarak eşleştirememiş olmasından kaynaklanıyor olabilir. Sistem hata yapmamış (yanlış bilgi vermemiş), ancak mevcut doğru bilgiyi yakalayamamış.

---

### Test 8: Rapor Teslim Tarihi
| | |
|---|---|
| **Kategori** | Bağlamsal Bütünlük |
| **Sorgu** | _"What is the report submission deadline?"_ |
| **Durum** | ✅ **BAŞARILI** |

**Chatbot Yanıtı:**
> The report due date is **October 24, 2025**, which is within the first 4 weeks of Fall 2025-2026.

**Değerlendirme:** Doğru tarih (24 Ekim 2025) ve dönem bilgisi sağlanmış. ✅

---

### Test 9: Hava Durumu (Kapsam Dışı)
| | |
|---|---|
| **Kategori** | Kapsam Dışı Sorgu |
| **Sorgu** | _"What's the weather like today?"_ |
| **Durum** | ✅ **BAŞARILI** |

**Chatbot Yanıtı:**
> I can only assist with METU-IE Summer Practice queries. This topic falls outside my scope. Please consult the relevant department or resource for assistance.

**Değerlendirme:** Kapsam dışı sorguyu doğru tespit etmiş ve system prompt'taki standart yanıtı birebir vermiş. ✅

---

### Test 10: Ünlü Kişi (Kapsam Dışı)
| | |
|---|---|
| **Kategori** | Kapsam Dışı Sorgu |
| **Sorgu** | _"Tell me about Elon Musk's career"_ |
| **Durum** | ✅ **BAŞARILI** |

**Chatbot Yanıtı:**
> I can only assist with METU-IE Summer Practice queries. This topic falls outside my scope. Please consult the relevant department or resource for assistance.

**Değerlendirme:** Tamamen ilgisiz bir konuyu doğru reddetmiş. Hallucination (uydurma) yok. ✅

---

### Test 11: Türkçe Sorgu — IE 400 Süresi
| | |
|---|---|
| **Kategori** | Çoklu Dil Desteği (Türkçe) |
| **Sorgu** | _"IE 400 için minimum staj süresi ne kadardır?"_ |
| **Durum** | ✅ **BAŞARILI** |

**Chatbot Yanıtı:**
> IE 400 için minimum staj süresi **30 iş günüdür** (6 hafta). Bu süre proje bazlı stajlar için de geçerlidir.

**Değerlendirme:** Türkçe soruya Türkçe yanıt vermiş. 30 iş günü ve 6 hafta bilgisi doğru. ✅

---

### Test 12: Türkçe Sorgu — DEICO Şirketi (added_files doğrulaması)
| | |
|---|---|
| **Kategori** | Eklenen Dosya Doğrulaması + Türkçe |
| **Sorgu** | _"DEICO şirketi hangi alanlarla ilgileniyor?"_ |
| **Durum** | ✅ **BAŞARILI** |

**Chatbot Yanıtı:**
> DEICO şirketi **Montaj, Üretim ve AR-GE** alanlarıyla ilgilenmektedir.

**Değerlendirme:** Bu bilgi **sadece** `added_files/Sp-opportunities.txt` dosyasında mevcut. Eski JSON veritabanında DEICO yoktu. Bu, yeni eklenen `added_files/` klasör taramasının çalıştığını doğruluyor. ✅

---

## 📈 Değerlendirme Kriterleri Bazında Sonuçlar

### 1. Teknik Dağıtım (Technical Deployment)
| Özellik | Durum |
|---------|:-----:|
| Uygulama localhost'ta çalışıyor | ✅ |
| API yanıt süresi < 15 sn | ✅ |
| Build hatası yok | ✅ |
| 124 chunk başarıyla indekslendi | ✅ |

### 2. Bağlamsal Bütünlük (Contextual Integrity)
| Sorgu Türü | Sonuç |
|------------|:-----:|
| Ön koşullar (IE 300) | ✅ Tam doğru |
| Gerekli belgeler | ✅ 8/8 listelendi |
| Kabul edilen şirket türleri | ✅ Tam doğru |
| SGK zamanlaması | ✅ Tam doğru |
| Yurt dışı staj | ✅ Erasmus bilgisi doğru |
| Rapor teslim tarihi | ✅ 24 Ekim 2025 doğru |
| Ücretli staj prosedürü | ⚠️ Bilgiyi bulamadı |

### 3. Kapsam Dışı Sorgu Yönetimi (Out-of-Scope)
| Sorgu | Sonuç |
|-------|:-----:|
| Hava durumu | ✅ Doğru reddetti |
| Ünlü kişi bilgisi | ✅ Doğru reddetti |
| Hallucination (uydurma) | ✅ Hiç yok |

---

## 🔍 Tespit Edilen İyileştirme Alanları

| # | Sorun | Önem | Önerilen Çözüm |
|---|-------|:----:|----------------|
| 1 | "How can I get paid" sorgusu ücretli staj bilgisini bulamıyor | Düşük | Paid SP prosedürünü `custom_faq.json`'a daha açık anahtar kelimelerle eklemek |
| 2 | Tarayıcıda Türkçe karakterler (ş, ç, ü, ö) bazen düşürülüyor | Düşük | Frontend input encoding kontrolü |
| 3 | İlk sorguda ~11 sn bekleme (indeksleme) | Orta | Server başlangıcında eager loading veya cache mekanizması |

---

## ✅ Sonuç

Chatbot, IE 304 proje gereksinimlerinde belirtilen **3 temel değerlendirme kriterini** büyük ölçüde karşılamaktadır:

1. **Teknik Dağıtım** — Uygulama hatasız çalışıyor ✅
2. **Bağlamsal Bütünlük** — 7 sorgudan 6'sı tam doğru (%86) ✅
3. **Kapsam Dışı Yönetimi** — 2/2 tam başarılı (%100) ✅

**Genel Değerlendirme: Teslime Hazır** 🚀
