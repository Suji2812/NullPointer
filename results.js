document.addEventListener('DOMContentLoaded', () => {
    const raw = localStorage.getItem('nullpointer_analysis');
    const filename = localStorage.getItem('nullpointer_filename') || 'dataset.csv';

    // Update filename in header
    const filenameEl = document.getElementById('fileNameDisplay');
if (filenameEl) filenameEl.textContent = filename.replace(' (Offline Fallback)', '');

    if (!raw) {
        // No data — show placeholder (demo mode)
        initChartPlaceholder();
        initHeatmapPlaceholder();
        initTabs();
        return;
    }

    let d = {};
try {
    d = JSON.parse(raw);
} catch (e) {
    console.error("Invalid analysis data");
}


    // Color code the score
    const scoreCard = document.querySelector('.score-card');
    if (scoreCard) {
        if (d.fairnessScore >= 70) {
            scoreCard.style.borderColor = 'rgba(0,196,140,0.3)';
            scoreCard.style.background = 'linear-gradient(180deg, rgba(0,196,140,0.05) 0%, var(--surface) 100%)';
        } else if (d.fairnessScore >= 40) {
            scoreCard.style.borderColor = 'rgba(255,181,71,0.3)';
            scoreCard.style.background = 'linear-gradient(180deg, rgba(255,181,71,0.05) 0%, var(--surface) 100%)';
        }
    }

    // Metric cards
    
    document.getElementById('fairnessScore').textContent =
    d.fairnessScore || 0;
    const scoreLabel = document.getElementById('scoreLabel');
if (scoreLabel) {
    if (d.fairnessScore >= 70) {
        scoreLabel.textContent = 'Low Bias Detected';
        scoreLabel.style.color = 'var(--success)';
    } else if (d.fairnessScore >= 40) {
        scoreLabel.textContent = 'Moderate Bias Detected';
        scoreLabel.style.color = 'var(--warning)';
    } else {
        scoreLabel.textContent = 'Critical Bias Detected';
        scoreLabel.style.color = 'var(--danger)';
    }
}
    document.getElementById('recordsAnalyzed').textContent =
    d.recordsAnalyzed?.toLocaleString() || 0;
    document.getElementById('biasPatterns').textContent = d.biasPatterns || 0;
    // Gemini plain English
    const plainText = document.getElementById('plainEnglishText');
if (plainText && d.plainEnglish) {
    plainText.textContent = d.plainEnglish;
}
    // Technical metrics
    const metricRows = document.querySelectorAll('#tab-tech tbody tr');
    if (metricRows.length >= 3 && d.technicalMetrics) {
        const metrics = [
            { name: 'Demographic Parity', val: d.technicalMetrics.demographicParity, pass: d.metricsPass.demographicParity },
            { name: 'Equalized Odds', val: d.technicalMetrics.equalizedOdds, pass: d.metricsPass.equalizedOdds },
            { name: 'Disparate Impact Ratio', val: d.technicalMetrics.disparateImpactRatio, pass: d.metricsPass.disparateImpactRatio }
        ];
        metricRows.forEach((row, i) => {
            const cells = row.querySelectorAll('td');
            if (cells[1]) cells[1].textContent = metrics[i].val.toFixed(2);
            if (cells[3]) cells[3].innerHTML = metrics[i].pass
                ? '<span class="badge badge-success">PASS</span>'
                : '<span class="badge badge-danger">FAIL</span>';
        });
    }

    // Heatmap
    initHeatmap(d.heatmap);

    // Chart stays hardcoded — needs historical data
    initChartPlaceholder();

    // Fix suggestions
    const fixCards = document.querySelectorAll('.fix-card p');
    if (d.fixes && d.fixes.length >= 3) {
        fixCards.forEach((p, i) => {
            if (d.fixes[i]) p.textContent = d.fixes[i];
        });
    }

    // Save counterfactual for fix.html
    if (d.counterfactual) {
        localStorage.setItem('nullpointer_counterfactual', JSON.stringify(d.counterfactual));
        localStorage.setItem('nullpointer_projectedScore', d.projectedScore);
        localStorage.setItem('nullpointer_fairnessScore', d.fairnessScore);
    }

    initTabs();
});

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-' + btn.getAttribute('data-tab')).classList.add('active');
        });
    });
}

function initHeatmap(heatmapData) {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const rows = heatmapData ? heatmapData.rows : ['White', 'Black', 'Asian', 'Hispanic'];
    const cols = heatmapData ? heatmapData.cols : ['Male', 'Female'];
const data = heatmapData ? heatmapData.data : [
    [1.0, 2.1],
    [1.5, 3.8]
];

    grid.style.gridTemplateColumns = `80px repeat(${cols.length}, 1fr)`;

    const emptyCell = document.createElement('div');
    grid.appendChild(emptyCell);

    cols.forEach(col => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell heatmap-col-header';
        cell.textContent = col;
        grid.appendChild(cell);
    });

    rows.forEach((row, i) => {
        const rowLabel = document.createElement('div');
        rowLabel.className = 'heatmap-cell heatmap-label';
        rowLabel.textContent = row;
        grid.appendChild(rowLabel);

        cols.forEach((_, j) => {
            const val = data[i][j];
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            cell.style.background = getColor(val);
            cell.textContent = val.toFixed(1) + '×';
            cell.style.animation = `popIn 0.4s cubic-bezier(0.4,0,0.2,1) forwards`;
            cell.style.animationDelay = `${(i * cols.length + j) * 0.02}s`;
            cell.style.opacity = '0';
            grid.appendChild(cell);
        });
    });
}

function initHeatmapPlaceholder() {
    initHeatmap(null);
}

function getColor(val) {
    if (val <= 1.2) return '#00C48C';
    if (val <= 2.0) return '#FFB547';
    if (val <= 3.5) return '#FF4B4B';
    return '#800020';
}

function initChartPlaceholder() {
    const ctx = document.getElementById('timeChart');
    if (!ctx) return;
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(255,75,75,0.4)');
    gradient.addColorStop(1, 'rgba(255,75,75,0.0)');
    new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['2018','2019','2020','2021','2022','2023','2024'],
        datasets: [{
            label: 'Fairness Score',
            data: [61,58,52,47,41,35,29],
            borderColor: '#FF4B4B',
            backgroundColor: gradient,
            borderWidth: 3,
            pointBackgroundColor: '#0F1117',
            pointBorderColor: '#FF4B4B',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: { right: 40 }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(26,29,39,0.9)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: { label: ctx => `Score: ${ctx.parsed.y}/100` }
            }
        },
        scales: {
            y: {
                min: 0, max: 100,
                grid: { color: 'rgba(255,255,255,0.05)', borderDash: [5,5] },
                ticks: { color: '#8B8FA8', stepSize: 20, padding: 10 }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#8B8FA8', padding: 10 }
            }
        }
    }
});
}