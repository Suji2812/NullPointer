document.addEventListener('DOMContentLoaded', () => {
    const btnTestRecord = document.getElementById('btnTestRecord');
    const counterfactualPanel = document.getElementById('counterfactualPanel');
    const scoreProgressBar = document.getElementById('scoreProgressBar');
    const afterScoreDisplay = document.getElementById('afterScoreDisplay');

    // Load real data from localStorage
    const cfRaw = localStorage.getItem('nullpointer_counterfactual');
    const projectedScore = localStorage.getItem('nullpointer_projectedScore') || 71;
    const beforeScore = localStorage.getItem('nullpointer_fairnessScore') || 34;

    if (cfRaw) {
        const cf = JSON.parse(cfRaw);

        // Update Gemini verdict
        const verdictEl = document.querySelector('.gemini-card p');
        if (verdictEl && cf.explanation) {
            verdictEl.innerHTML = cf.explanation;
        }

        // Update before score display
        const beforeEl = document.getElementById('beforeScoreDisplay');
        if (beforeEl) {
            beforeEl.innerHTML = `${beforeScore}<span style="font-size:1.5rem;color:var(--text-muted);font-weight:600;letter-spacing:0;">/100</span>`;
        }

        // Update after score
        if (afterScoreDisplay) {
            afterScoreDisplay.innerHTML = `${projectedScore}<span style="font-size:1.5rem;color:var(--text-muted);font-weight:600;letter-spacing:0;">/100</span>`;
        }
    }

    if (btnTestRecord && counterfactualPanel) {
        btnTestRecord.addEventListener('click', async () => {
            btnTestRecord.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i> Analyzing...';
            btnTestRecord.disabled = true;

            try {
                const response = await fetch(GEMINI_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: "Respond as an AI Fairness Auditor. Applicant #4821 (47yo, Black, Female, Rural, 8 yrs experience) was REJECTED. A directly equivalent Male profile would be APPROVED. Write a 2 sentence explanation of this disparate treatment bias and legal risk. Do not use markdown."
                            }]
                        }]
                    })
                });
                const data = await response.json();
                if (data.error) throw new Error(JSON.stringify(data.error));

                if (data.candidates && data.candidates[0].content.parts[0].text) {
                    const verdictEl = document.querySelector('.gemini-card p');
                    if (verdictEl) {
                        verdictEl.innerHTML = data.candidates[0].content.parts[0].text;
                    }
                }
            } catch (err) {
                console.error('Gemini API Error:', err);
                if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('Quota')) {
                    const verdictEl = document.querySelector('.gemini-card p');
                    if (verdictEl) {
                        verdictEl.innerHTML = "Applicant #4821 was rejected <strong style='color: var(--danger);'>solely due to gender</strong>. The identically scored profile with a male gender identity would have been approved. This constitutes explicit disparate treatment under EEOC guidelines. <i>(Generated via Local Fallback)</i>";
                    }
                } else {
                    btnTestRecord.innerHTML = 'Analysis Failed <i class="fa-solid fa-xmark" style="margin-left:8px;"></i>';
                    btnTestRecord.disabled = false;
                    return;
                }
            }

            btnTestRecord.innerHTML = 'Tested <i class="fa-solid fa-check" style="margin-left:8px;"></i>';
            btnTestRecord.style.background = 'var(--success)';
            btnTestRecord.style.boxShadow = 'none';
            counterfactualPanel.style.display = 'block';
            counterfactualPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

            setTimeout(() => {
                if (scoreProgressBar) {
                    scoreProgressBar.style.width = projectedScore + '%';
                    scoreProgressBar.style.background = 'var(--success)';
                }
            }, 1200);
        });
    }
});