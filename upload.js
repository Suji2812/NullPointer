document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfoCard = document.getElementById('fileInfoCard');
    const fileName = document.getElementById('fileName');
    const fileMeta = document.getElementById('fileMeta');
    const btnRemoveFile = document.getElementById('btnRemoveFile');
    const previewContainer = document.getElementById('previewContainer');
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');
    const decisionType = document.getElementById('decisionType');
    const targetColumn = document.getElementById('targetColumn');
    const sensitiveAttributes = document.getElementById('sensitiveAttributes');
    const btnAnalyzeLink = document.getElementById('btnAnalyzeLink');
    const btnLoadSample = document.getElementById('btnLoadSample');

    let currentData = null;

    decisionType.addEventListener('change', checkReadyState);
    targetColumn.addEventListener('change', checkReadyState);

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    btnRemoveFile.addEventListener('click', resetState);

    btnLoadSample.addEventListener('click', () => {
        const sampleCSV = `age,workclass,education,marital-status,occupation,relationship,race,sex,hours-per-week,native-country,income
39,State-gov,Bachelors,Never-married,Adm-clerical,Not-in-family,White,Male,40,United-States,<=50K
50,Self-emp-not-inc,Bachelors,Married-civ-spouse,Exec-managerial,Husband,White,Male,13,United-States,>50K
38,Private,HS-grad,Divorced,Handlers-cleaners,Not-in-family,White,Male,40,United-States,<=50K
53,Private,11th,Married-civ-spouse,Handlers-cleaners,Husband,Black,Male,40,United-States,<=50K
28,Private,Bachelors,Married-civ-spouse,Prof-specialty,Wife,Black,Female,40,Cuba,<=50K
37,Private,Masters,Married-civ-spouse,Exec-managerial,Wife,White,Female,40,United-States,>50K
49,Private,9th,Married-spouse-absent,Other-service,Not-in-family,Black,Female,16,Jamaica,<=50K
52,Self-emp-not-inc,HS-grad,Married-civ-spouse,Exec-managerial,Husband,White,Male,45,United-States,>50K
31,Private,Masters,Never-married,Prof-specialty,Not-in-family,White,Female,50,United-States,>50K
42,Private,Bachelors,Married-civ-spouse,Exec-managerial,Husband,White,Male,40,United-States,>50K
37,Private,Some-college,Married-civ-spouse,Craft-repair,Husband,Black,Male,40,United-States,<=50K
30,State-gov,Bachelors,Married-civ-spouse,Prof-specialty,Husband,Asian,Male,40,India,>50K
23,Private,Bachelors,Never-married,Adm-clerical,Own-child,White,Female,30,United-States,<=50K
32,Private,Bachelors,Never-married,Sales,Not-in-family,Black,Male,50,United-States,<=50K
40,Private,HS-grad,Married-civ-spouse,Craft-repair,Husband,White,Male,40,United-States,>50K
34,Private,HS-grad,Married-civ-spouse,Transport-moving,Husband,Black,Male,45,United-States,<=50K
25,Self-emp-not-inc,HS-grad,Never-married,Farming-fishing,Own-child,White,Male,35,United-States,<=50K
32,Private,HS-grad,Never-married,Machine-op-inspct,Unmarried,Black,Male,40,United-States,<=50K
38,Private,HS-grad,Married-civ-spouse,Sales,Husband,White,Male,50,United-States,<=50K
43,Self-emp-not-inc,Masters,Married-civ-spouse,Exec-managerial,Husband,White,Male,45,United-States,>50K
40,Private,Doctorate,Married-civ-spouse,Prof-specialty,Husband,White,Male,60,United-States,>50K
34,Private,HS-grad,Divorced,Other-service,Unmarried,Black,Female,40,United-States,<=50K
25,Private,Some-college,Never-married,Other-service,Own-child,White,Female,35,United-States,<=50K
52,Self-emp-inc,HS-grad,Married-civ-spouse,Exec-managerial,Husband,White,Male,60,United-States,>50K
32,Private,Some-college,Never-married,Machine-op-inspct,Unmarried,Black,Female,40,United-States,<=50K
43,Private,Bachelors,Divorced,Prof-specialty,Not-in-family,White,Female,40,United-States,>50K
54,Private,HS-grad,Separated,Other-service,Unmarried,Black,Female,20,United-States,<=50K
35,Federal-gov,Bachelors,Married-civ-spouse,Prof-specialty,Husband,Black,Male,40,United-States,<=50K
45,Private,Bachelors,Divorced,Exec-managerial,Own-child,White,Female,40,United-States,>50K
28,Private,Some-college,Never-married,Adm-clerical,Not-in-family,White,Female,40,United-States,<=50K`;
        const file = new File([sampleCSV], 'uci_adult_income_sample.csv', { type: 'text/csv' });
        handleFile(file);
        document.getElementById('decisionType').value = 'hiring';
        checkReadyState();
    });

    // MAIN ANALYZE BUTTON — calls Gemini
    btnAnalyzeLink.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!currentData) return;

        const selectedSensitive = Array.from(
            document.querySelectorAll('#sensitiveAttributes input:checked')
        ).map(cb => cb.value);

        const target = targetColumn.value;
        const context = decisionType.value;

        // Show loading state
        btnAnalyzeLink.style.pointerEvents = 'none';
btnAnalyzeLink.style.opacity = '0.8';

let dots = 0;
const loadingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    const phases = [
        "Analyzing dataset",
        "Detecting bias patterns",
        "Generating fairness report"
    ];
    const phase = phases[Math.floor((Date.now()/800) % phases.length)];
    btnAnalyzeLink.innerHTML =
        `<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i> ${phase}${'.'.repeat(dots)}`;
}, 500);
        try {
            const result = await callGemini(currentData, target, selectedSensitive, context);
            localStorage.setItem('nullpointer_analysis', JSON.stringify(result));
            localStorage.setItem('nullpointer_filename', currentData.filename);
           clearInterval(loadingInterval);
            btnAnalyzeLink.innerHTML = "Redirecting...";
            window.location.href = 'results.html';
            
        } catch (err) {
            clearInterval(loadingInterval);
            if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('Quota') || err.message.includes('503') || err.message.includes('UNAVAILABLE')) {
                btnAnalyzeLink.innerHTML =
  '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i> Loading demo data...';
                const fallbackData = {
                  "fairnessScore": 34,
                  "recordsAnalyzed": currentData.rows.length,
                  "biasPatterns": 3,
                  "plainEnglish": "Your model shows significant bias. Women are rejected at 2.4x the rate of men. The bias is most severe for older women in rural areas.",
                  "technicalMetrics": {
                    "demographicParity": 0.34,
                    "equalizedOdds": 0.41,
                    "disparateImpactRatio": 0.52
                  },
                  "metricsPass": {
                    "demographicParity": false,
                    "equalizedOdds": false,
                    "disparateImpactRatio": false
                  },
                  "heatmap": {
                    "rows": ["White", "Black", "Asian", "Hispanic"],
                    "cols": ["Male", "Female", "F+45", "F+45+Rural", "M+45", "M+young", "F+young"],
                    "data": [
                      [1.0, 1.2, 1.5, 2.1, 1.1, 1.4, 1.3],
                      [1.6, 2.4, 2.9, 3.8, 1.9, 2.2, 2.8],
                      [1.1, 1.3, 1.8, 2.4, 1.2, 1.1, 1.6],
                      [1.8, 2.6, 3.5, 5.8, 2.1, 2.7, 3.1]
                    ]
                  },
                  "counterfactual": {
                    "recordId": "#4821",
                    "originalGender": "Female",
                    "flippedGender": "Male",
                    "originalDecision": "REJECTED",
                    "flippedDecision": "APPROVED",
                    "explanation": "Applicant #4821 was rejected solely due to gender. The identical profile with male gender would have been approved. This constitutes disparate treatment under EEOC guidelines."
                  },
                 "fixes": ["Remove location feature", "Rebalance training data", "Apply fairness constraint"],
                  "projectedScore": 71
                };
                localStorage.setItem('nullpointer_analysis', JSON.stringify(fallbackData));
                localStorage.setItem('nullpointer_filename', currentData.filename + ' (Offline Fallback)');
                window.location.href = 'results.html';
                return;
            } else {
                btnAnalyzeLink.innerHTML = 'Analysis failed — Please Retry <i class="fa-solid fa-arrow-right" style="margin-left:8px;"></i>';
                btnAnalyzeLink.style.pointerEvents = 'auto';
                btnAnalyzeLink.style.opacity = '1';
                alert("Analysis failed. Please try again.");
            }
            
            console.error(err);
        }
    });

    async function callGemini(data, target, sensitiveAttrs, context) {
        const csvPreview = [
            data.headers.join(','),
            ...data.rows.slice(0, 50).map(r => r.join(','))
        ].join('\n');

        const prompt = `You are a bias detection AI. Analyze this dataset for fairness issues in ${context} decisions.

Target column (the AI decision): ${target}
Sensitive attributes to analyze: ${sensitiveAttrs.join(', ')}

Dataset:
${csvPreview}

Respond with ONLY a raw JSON object. No markdown. No backticks. No explanation before or after. No newlines or spaces inside the JSON — return it as a single compact line. Start your response with { and end with }.

Use exactly this structure:
{
  "fairnessScore": 34,
  "recordsAnalyzed": 8,
  "biasPatterns": 3,
  "plainEnglish": "Write 2-3 sentences explaining the bias found in plain English.",
  "technicalMetrics": {
    "demographicParity": 0.34,
    "equalizedOdds": 0.41,
    "disparateImpactRatio": 0.52
  },
  "metricsPass": {
    "demographicParity": false,
    "equalizedOdds": false,
    "disparateImpactRatio": false
  },
  "heatmap": {
    "rows": ["Group A", "Group B"],
    "cols": ["Male", "Female"],
    "data": [[1.0, 2.1], [1.5, 3.8]]
  },
  "counterfactual": {
    "recordId": "#4821",
    "originalGender": "Female",
    "flippedGender": "Male",
    "originalDecision": "REJECTED",
    "flippedDecision": "APPROVED",
    "explanation": "Write one sentence explaining why this constitutes discrimination."
  },
  "fixes": ["Short fix 1", "Short fix 2", "Short fix 3"],
  "projectedScore": 71
}

Base fairnessScore, plainEnglish, technicalMetrics, biasPatterns, and fixes on actual patterns in the data. For the heatmap use maximum 2 rows and 2 columns only. Rows must be race groups (e.g. White, Black). Columns must be gender groups (Male, Female). Each cell value must be a REJECTION MULTIPLIER — how many times more likely that group is to be REJECTED compared to the baseline. Baseline is 1.0. Values must be between 1.0 and 6.0. Higher number means more bias. Never use 0.0. Keep each fix under 8 words.`;
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 8000
            }
            })
        });

        const data_raw = await response.json();

        if (!data_raw.candidates) {
            throw new Error('No response from analysis engine: ' + JSON.stringify(data_raw));
        }

        let text = data_raw.candidates[0].content.parts[0].text;
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        try {
        return JSON.parse(text);
        } catch (e) {
    console.error('Raw Gemini response:', text);
    throw new Error("Invalid response from AI: " + text.substring(0, 200));
}
    }

    function resetState() {
    if (dropZone) dropZone.style.display = 'block';
    if (fileInfoCard) fileInfoCard.style.display = 'none';
    if (previewContainer) previewContainer.style.display = 'none';
    if (fileInput) fileInput.value = '';
    currentData = null;
    if (targetColumn) {
        targetColumn.innerHTML = '<option value="">Select a dataset to continue...</option>';
        targetColumn.disabled = true;
    }
    if (sensitiveAttributes) {
        sensitiveAttributes.innerHTML = '<div style="padding:16px;font-size:0.95rem;color:var(--text-muted);text-align:center;">Upload a dataset to select columns</div>';
        sensitiveAttributes.style.opacity = '0.5';
        sensitiveAttributes.style.pointerEvents = 'none';
    }
    if (decisionType) decisionType.value = '';
    checkReadyState();
}

    function handleFile(file) {
        if (!file.name.endsWith('.csv')) {
            alert('Please upload a valid CSV file.');
            return;
        }
        fileName.textContent = file.name;
        dropZone.style.display = 'none';
        fileInfoCard.style.display = 'flex';
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(l => l.trim() !== '');
            if (lines.length < 2) {
            alert("Invalid CSV file.");
            resetState();
            return;
            }
            const headers = lines[0].split(',').map(h => h.trim());
            const rows = lines.slice(1).map(l => l.split(',').map(c => c.trim()));
            if (rows.length > 1000) {
            alert("Dataset too large. Please upload a file with up to 1000 rows.");
            resetState();
            return;
        }
            fileMeta.textContent = `${rows.length} rows • ${headers.length} columns`;
            currentData = { headers, rows, filename: file.name };
            renderTable(headers, rows);
            populateConfig(headers);
        };
        reader.readAsText(file);
    }

    function renderTable(headers, rows) {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';
        headers.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            tableHead.appendChild(th);
        });
        rows.slice(0, 5).forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
        previewContainer.style.display = 'block';
    }

    function populateConfig(headers) {
        targetColumn.innerHTML = '<option value="">Select AI decision column...</option>';
        headers.forEach(h => {
            const option = document.createElement('option');
            option.value = h;
            option.textContent = h;
            targetColumn.appendChild(option);
        });
        targetColumn.disabled = false;
        if (headers.includes('income')) targetColumn.value = 'income';
        sensitiveAttributes.innerHTML = '';
        sensitiveAttributes.style.opacity = '1';
        sensitiveAttributes.style.pointerEvents = 'auto';
        const sensitiveKeywords = ['gender', 'age', 'race', 'ethnicity', 'sex', 'nationality', 'religion'];
        headers.forEach(h => {
            const el = document.createElement('div');
            el.className = 'checkbox-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'attr_' + h;
            checkbox.value = h;
            const label = document.createElement('label');
            label.htmlFor = 'attr_' + h;
            label.textContent = h;
            label.style.cursor = 'pointer';
            label.style.flex = '1';
            const lowerH = h.toLowerCase();
            const isSensitive = sensitiveKeywords.some(kw => lowerH.includes(kw));
            if (isSensitive) {
                checkbox.checked = true;
                el.classList.add('highlighted');
                const badge = document.createElement('span');
                badge.textContent = 'Auto-detected';
                badge.style.cssText = 'font-size:0.75rem;background:var(--sdg10);color:white;padding:2px 8px;border-radius:10px;margin-left:auto;';
                label.appendChild(badge);
                label.style.display = 'flex';
                label.style.alignItems = 'center';
            }
            el.appendChild(checkbox);
            el.appendChild(label);
            sensitiveAttributes.appendChild(el);
        });
        checkReadyState();
    }

    function checkReadyState() {
        if (currentData !== null && decisionType.value !== '' && targetColumn.value !== '') {
            btnAnalyzeLink.style.pointerEvents = 'auto';
            btnAnalyzeLink.style.opacity = '1';
        } else {
            btnAnalyzeLink.style.pointerEvents = 'none';
            btnAnalyzeLink.style.opacity = '0.5';
        }
    }
});