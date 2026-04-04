import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AddJob = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState('en'); // en, hi, gu
  const [useDefault, setUseDefault] = useState(true);

  // Default content per language
  const defaultContent = {
    en: {
      title: 'Default English Title',
      description: 'Verified and skilled mason service for residential and commercial projects.',
      whatYouGet: [
        'Verified worker(s) as per your booking',
        'Skilled in the selected trade',
        'Standard 8-hour shift',
        'Basic safety check'
      ],
      whatYouNotGet: [
        'Raw materials (cement, paint, bricks, etc.)',
        'Heavy machinery (cranes, mixers, etc.)',
        'Overtime charges (beyond 8 hours)'
      ],
      processSteps: [
        { title: 'Step 1', description: 'Pick the type of worker you need for your site.' },
        { title: 'Step 2', description: 'Select number of workers, date, and shifts, then confirm.' },
        { title: 'Step 3', description: 'Workers arrive on time, you pay securely in-app.' }
      ],
      faqs: [
        { question: 'Are workers verified?', answer: 'Yes, every worker is ID-checked and background verified.' },
        { question: 'Can I extend their shift?', answer: 'Yes, you can request an extension through the app or support.' },
        { question: 'Do they bring tools?', answer: 'Basic tools are provided, heavy machinery must be arranged by client.' },
        { question: 'What if a worker cancels?', answer: 'We provide replacement or full refund.' },
        { question: 'How is pricing calculated?', answer: 'Based on standard 8-hour shift, overtime charged separately.' }
      ]
    },
    hi: {
      title: 'डिफ़ॉल्ट हिंदी शीर्षक',
      description: 'निवास और वाणिज्यिक परियोजनाओं के लिए प्रमाणित और कुशल कारीगर सेवा।',
      whatYouGet: [
        'बुकिंग के अनुसार प्रमाणित कर्मचारी',
        'चयनित पेशे में कुशल',
        'मानक 8 घंटे की शिफ्ट',
        'मूल सुरक्षा जांच'
      ],
      whatYouNotGet: [
        'कच्चा माल (सीमेंट, पेंट, ईंट, आदि)',
        'भारी मशीनरी (क्रेन, मिक्सर, आदि)',
        'ओवरटाइम शुल्क (8 घंटे से अधिक)'
      ],
      processSteps: [
        { title: 'स्टेप 1', description: 'अपने साइट के लिए आवश्यक श्रमिक का प्रकार चुनें।' },
        { title: 'स्टेप 2', description: 'कर्मचारियों की संख्या, दिनांक और शिफ्ट चुनें और पुष्टि करें।' },
        { title: 'स्टेप 3', description: 'कर्मचारी समय पर आते हैं, आप सुरक्षित तरीके से भुगतान करते हैं।' }
      ],
      faqs: [
        { question: 'क्या कर्मचारी सत्यापित हैं?', answer: 'हाँ, हर कर्मचारी की पहचान और पृष्ठभूमि सत्यापित होती है।' },
        { question: 'क्या मैं उनकी शिफ्ट बढ़ा सकता हूँ?', answer: 'हाँ, आप ऐप या सपोर्ट के माध्यम से विस्तार का अनुरोध कर सकते हैं।' }
      ]
    },
    gu: {
      title: 'ડિફોલ્ટ ગુજરાતી ટાઈટલ',
      description: 'રહેણાંક અને વાણિજ્યિક પ્રોજેક્ટ માટે પ્રમાણિત અને કુશળ મજૂર સેવા.',
      whatYouGet: [
        'બુકિંગ મુજબ પ્રમાણિત કર્મચારી',
        'ચુંટાયેલા વ્યવસાયમાં કુશળ',
        'સ્ટાન્ડર્ડ 8-કલાક શિફ્ટ',
        'બેઝિક સુરક્ષા તપાસ'
      ],
      whatYouNotGet: [
        'કાચા માલ (સિમેન્ટ, પેઇન્ટ, ઈંટ, વગેરે)',
        'ભારી મશીનરી (ક્રેન, મિક્સર, વગેરે)',
        'ઓવરસમ સમય ચાર્જ (8 કલાકથી વધુ)'
      ],
      processSteps: [
        { title: 'સ્ટેપ 1', description: 'તમારા સાઇટ માટે જરૂરી મજૂરનો પ્રકાર પસંદ કરો.' },
        { title: 'સ્ટેપ 2', description: 'કર્મચારીઓની સંખ્યા, તારીખ અને શિફ્ટ પસંદ કરો અને પુષ્ટિ કરો.' },
        { title: 'સ્ટેપ 3', description: 'કર્મચારીઓ સમય પર આવે છે, તમે સુરક્ષિત રીતે ચૂકવણી કરો છો.' }
      ],
      faqs: [
        { question: 'શું કર્મચારીઓ ચકાસાયેલા છે?', answer: 'હાં, દરેક કર્મચારીનું આઈડી અને પૃષ્ઠભૂમિ ચકાસાય છે.' },
        { question: 'શું હું તેમની શિફ્ટ લંબાવી શકું?', answer: 'હાં, તમે એપ અથવા સપોર્ટ દ્વારા વિસ્તરણનો વિનંતી કરી શકો છો.' }
      ]
    }
  };

  const [multiLangData, setMultiLangData] = useState({
    en: { ...defaultContent.en },
    hi: { ...defaultContent.hi },
    gu: { ...defaultContent.gu }
  });

  const [pricing, setPricing] = useState([{ timeFrame: '', price: '' }]);
  const [files, setFiles] = useState({ cardImage: null, coverImage: null, otherImage: null });
  const [category, setCategory] = useState('');

  useEffect(() => {
    api.get('/job-categories').then(res => setCategories(res.data));
  }, []);

  const handleDefaultToggle = (value) => {
    setUseDefault(value);
    if (value) {
      setMultiLangData({
        en: { ...defaultContent.en },
        hi: { ...defaultContent.hi },
        gu: { ...defaultContent.gu }
      });
    } else {
      setMultiLangData({
        en: { title: '', description: '', whatYouGet: [], whatYouNotGet: [], processSteps: [], faqs: [] },
        hi: { title: '', description: '', whatYouGet: [], whatYouNotGet: [], processSteps: [], faqs: [] },
        gu: { title: '', description: '', whatYouGet: [], whatYouNotGet: [], processSteps: [], faqs: [] }
      });
    }
  };

  const handleArrayChange = (lang, section, index, field, value) => {
    const newArray = [...multiLangData[lang][section]];
    if (field === null) newArray[index] = value;
    else newArray[index][field] = value;
    setMultiLangData({ ...multiLangData, [lang]: { ...multiLangData[lang], [section]: newArray } });
  };

  const addRow = (lang, section, template) => {
    setMultiLangData({
      ...multiLangData,
      [lang]: { ...multiLangData[lang], [section]: [...multiLangData[lang][section], template] }
    });
  };

  const removeRow = (lang, section, index) => {
    const newArray = multiLangData[lang][section].filter((_, i) => i !== index);
    setMultiLangData({ ...multiLangData, [lang]: { ...multiLangData[lang], [section]: newArray } });
  };

  const switchLang = (lang) => setActiveLang(lang);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const data = new FormData();
  
    // Root-level English fields
    data.append('jobName', multiLangData.en.title);
    data.append('jobDescription', multiLangData.en.description);
    data.append('whatYouGet', JSON.stringify(multiLangData.en.whatYouGet));
    data.append('whatYouNotGet', JSON.stringify(multiLangData.en.whatYouNotGet));
    data.append('processSteps', JSON.stringify(multiLangData.en.processSteps));
    data.append('faqs', JSON.stringify(multiLangData.en.faqs));
    data.append('pricing', JSON.stringify(pricing));
    data.append('category', category);
  
    // Images
    if (files.cardImage) data.append('cardImage', files.cardImage);
    if (files.coverImage) data.append('coverImage', files.coverImage);
    if (files.otherImage) data.append('otherImage', files.otherImage);
  
    // Multilingual content
    const otherlang = [];
    ['hi', 'gu'].forEach(lang => {
      if (multiLangData[lang].title || multiLangData[lang].description) {
        otherlang.push({
          lang,
          jobName: multiLangData[lang].title,
          jobDescription: multiLangData[lang].description,
          whatYouGet: multiLangData[lang].whatYouGet || [],
          whatYouNotGet: multiLangData[lang].whatYouNotGet || [],
          processSteps: multiLangData[lang].processSteps || [],
          faqs: multiLangData[lang].faqs || [],
        });
      }
    });
  
    // ✅ Send as string, backend must parse
    if (otherlang.length) data.append('otherlang', JSON.stringify(otherlang));
  
    try {
      await api.post('/jobs', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/jobs');
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content px-4 py-4">
      <form onSubmit={handleSubmit}>
        {/* Default Content Toggle */}
        <div className='row'>
        <div className="mb-3 col-6">
          <label className="form-label me-3">Default Content:</label>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="defaultToggle" checked={useDefault} onChange={() => handleDefaultToggle(true)} />
            <label className="form-check-label">ON</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="defaultToggle" checked={!useDefault} onChange={() => handleDefaultToggle(false)} />
            <label className="form-check-label">OFF</label>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="mb-3 col-6 d-flex align-items-center justify-content-end">
  <label className="form-label me-3 mb-0">Language:</label>
  <button
    type="button"
    className={`btn btn-sm ${activeLang === 'en' ? 'btn-primary' : 'btn-light'} me-2`}
    onClick={() => switchLang('en')}
  >
    English
  </button>
  <button
    type="button"
    className={`btn btn-sm ${activeLang === 'hi' ? 'btn-primary' : 'btn-light'} me-2`}
    onClick={() => switchLang('hi')}
  >
    Hindi
  </button>
  <button
    type="button"
    className={`btn btn-sm ${activeLang === 'gu' ? 'btn-primary' : 'btn-light'}`}
    onClick={() => switchLang('gu')}
  >
    Gujarati
  </button>
</div>
        </div>

        <div className="row">
          {/* Left Column: Basic Info & Images */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Basic Information</h6>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Job Name</label>
                  <input type="text" className="form-control" value={multiLangData[activeLang].title} onChange={e => setMultiLangData({ ...multiLangData, [activeLang]: { ...multiLangData[activeLang], title: e.target.value } })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Category</label>
                  <select className="form-select" onChange={e => setCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Job Description</label>
                  <textarea className="form-control" rows="3" value={multiLangData[activeLang].description} onChange={e => setMultiLangData({ ...multiLangData, [activeLang]: { ...multiLangData[activeLang], description: e.target.value } })} required />
                </div>

                <h6 className="fw-bold mt-4 mb-3">Media Assets</h6>
                <div className="mb-3">
                  <label className="form-label small">Card Image</label>
                  <input type="file" className="form-control" onChange={e => setFiles({ ...files, cardImage: e.target.files[0] })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Cover Banner</label>
                  <input type="file" className="form-control" onChange={e => setFiles({ ...files, coverImage: e.target.files[0] })} required />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Pricing Options</h6>
                  <button type="button" className="btn btn-sm btn-dark" onClick={() => setPricing([...pricing, { timeFrame: '', price: '' }])}>+ Add Rate</button>
                </div>
                {pricing.map((p, i) => (
  <div key={i} className="row g-2 mb-2">
    {/* Price */}
    <div className="col-6">
      <input
        placeholder="Price (₹)"
        type="number"
        className="form-control form-control-sm"
        value={p.price}
        onChange={e => setPricing(pricing.map((pr, idx) => idx === i ? { ...pr, price: e.target.value } : pr))}
      />
    </div>

    {/* Time */}
    <div className="col-4">
      <input
        placeholder="Time (e.g. 1 hr)"
        className="form-control form-control-sm"
        value={p.timeFrame}
        onChange={e => setPricing(pricing.map((pr, idx) => idx === i ? { ...pr, timeFrame: e.target.value } : pr))}
      />
    </div>

    {/* Delete button */}
    <div className="col-2">
      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setPricing(pricing.filter((_, idx) => idx !== i))}>×</button>
    </div>
  </div>
))}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Lists & Steps */}
          <div className="col-lg-7">
            {/* What You Get / What You Not Get */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold">What You Get</h6>
                    {multiLangData[activeLang].whatYouGet.map((item, i) => (
                      <input key={i} className="form-control form-control-sm mb-2" value={item} onChange={e => handleArrayChange(activeLang, 'whatYouGet', i, null, e.target.value)} />
                    ))}
                    <button type="button" className="btn btn-sm text-primary p-0" onClick={() => addRow(activeLang, 'whatYouGet', '')}>+ Add Point</button>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold">What You Not Get</h6>
                    {multiLangData[activeLang].whatYouNotGet.map((item, i) => (
                      <input key={i} className="form-control form-control-sm mb-2" value={item} onChange={e => handleArrayChange(activeLang, 'whatYouNotGet', i, null, e.target.value)} />
                    ))}
                    <button type="button" className="btn btn-sm text-primary p-0" onClick={() => addRow(activeLang, 'whatYouNotGet', '')}>+ Add Point</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Service Process Steps</h6>
                  <button type="button" className="btn btn-sm btn-dark" onClick={() => addRow(activeLang, 'processSteps', { title: '', description: '' })}>+ Add Step</button>
                </div>
                {multiLangData[activeLang].processSteps.map((s, i) => (
                  <div key={i} className="border-bottom pb-3 mb-3">
                    <div className="d-flex mb-2">
                      <input placeholder="Step Title" className="form-control form-control-sm me-2" value={s.title} onChange={e => handleArrayChange(activeLang, 'processSteps', i, 'title', e.target.value)} />
                      <button type="button" className="btn btn-sm btn-link text-danger" onClick={() => removeRow(activeLang, 'processSteps', i)}>Delete</button>
                    </div>
                    <textarea placeholder="Step Description" className="form-control form-control-sm" rows="2" value={s.description} onChange={e => handleArrayChange(activeLang, 'processSteps', i, 'description', e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Service FAQs</h6>
                {multiLangData[activeLang].faqs.map((f, i) => (
                  <div key={i} className="mb-3 p-2 bg-light rounded">
                    <input placeholder="Question" className="form-control form-control-sm mb-2" value={f.question} onChange={e => handleArrayChange(activeLang, 'faqs', i, 'question', e.target.value)} />
                    <textarea placeholder="Answer" className="form-control form-control-sm" rows="2" value={f.answer} onChange={e => handleArrayChange(activeLang, 'faqs', i, 'answer', e.target.value)} />
                    <button type="button" className="btn btn-sm btn-link text-danger mt-1" onClick={() => removeRow(activeLang, 'faqs', i)}>Delete</button>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-dark" onClick={() => addRow(activeLang, 'faqs', { question: '', answer: '' })}>+ Add FAQ</button>
              </div>
            </div>

          </div>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Job'}</button>
        </div>

      </form>
    </div>
  );
};

export default AddJob;