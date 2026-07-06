// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const startBtn = document.getElementById('start-btn');
const landingPage = document.getElementById('landing-page');
const dashboardPage = document.getElementById('dashboard-page');
const scenarioSelect = document.getElementById('scenario-select');
const runScenarioBtn = document.getElementById('run-scenario-btn');
const agentGrid = document.getElementById('agent-grid');
const taskList = document.getElementById('task-list');
const mapContainer = document.getElementById('map-container');

// Theme Management
let isDarkMode = false;
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    themeIcon.textContent = isDarkMode ? 'light_mode' : 'dark_mode';
});

// View Navigation
startBtn.addEventListener('click', () => {
    landingPage.classList.remove('active');
    dashboardPage.classList.add('active');
});

scenarioSelect.addEventListener('change', () => {
    runScenarioBtn.disabled = false;
});

// Agents Definition
const agents = [
    { id: 'incident', name: 'Incident Analysis', icon: 'analytics' },
    { id: 'resource', name: 'Resource Allocation', icon: 'local_shipping' },
    { id: 'volunteer', name: 'Volunteer Coordination', icon: 'group' },
    { id: 'communication', name: 'Communication', icon: 'campaign' },
    { id: 'decision', name: 'Decision Support', icon: 'psychology' },
    { id: 'report', name: 'Situation Report', icon: 'summarize' }
];

// Scenarios Database (Mock Output Data)
const scenariosData = {
    earthquake: {
        incident: { reasoning: "Analyzing seismic data and 911 call volume...", output: "Magnitude 7.2 earthquake detected. High severity. Urgent needs: Search & Rescue, Trauma care, Temporary shelter.", tasks: [{title: "Dispatch S&R Teams", priority: "high"}] },
        resource: { reasoning: "Checking local hospital capacity and structural integrity...", output: "Redirecting trauma cases to City General (15 beds available). Dispatching 3 heavy machinery units to Sector 4.", tasks: [{title: "Allocate 3 Heavy Extractors", priority: "high"}] },
        volunteer: { reasoning: "Filtering local registered volunteers for medical and structural expertise...", output: "Matched 45 certified first-responders. Generating deployment assignments to Sector 4.", tasks: [{title: "Deploy Volunteer Batch A", priority: "medium"}] },
        communication: { reasoning: "Drafting public safety alerts based on severity...", output: "SMS & Push notifications sent to 2M residents: 'Seek high ground, avoid downtown due to structural risks. Multilingual formats dispatched.", tasks: [{title: "Broadcast Emergency SMS", priority: "high"}] },
        decision: { reasoning: "Evaluating bottlenecks in resource flow...", output: "Bottleneck detected on I-95 South. Recommend rerouting emergency transport via Route 44. Prioritizing power grid stabilization.", tasks: [{title: "Reroute Emergency Transport", priority: "high"}] },
        report: { reasoning: "Synthesizing agent activities...", output: "Executive Summary PDF generated. 3 sectors heavily impacted. Response timeline tracking active.", tasks: [{title: "Distribute Exec Report", priority: "low"}] }
    },
    wildfire: {
        incident: { reasoning: "Analyzing satellite heat signatures and wind patterns...", output: "Fast-moving wildfire approaching Suburban Fringe. Wind speed 45mph. Urgent needs: Evacuation transport, Fire retardant drops.", tasks: [{title: "Initiate Evacuation Zone C", priority: "high"}] },
        resource: { reasoning: "Checking aerial asset availability...", output: "2 water bombers dispatched. Activating 5 public schools as emergency shelters.", tasks: [{title: "Activate School Shelters", priority: "high"}] },
        volunteer: { reasoning: "Identifying logistics and transport volunteers...", output: "Matched 120 volunteers with large vehicles for evacuation assistance.", tasks: [{title: "Coordinate Evac Drivers", priority: "medium"}] },
        communication: { reasoning: "Drafting evacuation orders...", output: "Mandatory Evacuation Order broadcasted to Zone C. Sent out shelter location maps via SMS.", tasks: [{title: "Broadcast Evacuation Maps", priority: "high"}] },
        decision: { reasoning: "Predicting fire path based on wind...", output: "High risk of fire crossing Interstate 8. Recommend preemptive road closures.", tasks: [{title: "Close Interstate 8", priority: "medium"}] },
        report: { reasoning: "Compiling containment metrics...", output: "Situation Report: 15% contained. 4,000 residents evacuated. Zero casualties reported.", tasks: [{title: "Update Containment Dashboard", priority: "low"}] }
    },
    flood: {
        incident: { reasoning: "Monitoring river gauges and rainfall forecasts...", output: "Severe flash flooding in Coastal City. Water levels rising 2ft/hr. Urgent needs: Swift-water rescue, sandbags.", tasks: [{title: "Dispatch Swift-water Rescue", priority: "high"}] },
        resource: { reasoning: "Locating boats and pumping equipment...", output: "15 rescue boats deployed. Ordering 100,000 sandbags from regional depot.", tasks: [{title: "Deploy Rescue Boats", priority: "high"}] },
        volunteer: { reasoning: "Finding sandbag filling volunteers...", output: "Mobilized 300 volunteers at community centers for sandbag preparation.", tasks: [{title: "Organize Sandbag Teams", priority: "medium"}] },
        communication: { reasoning: "Issuing boil water advisories...", output: "Public alert: 'Boil water advisory in effect. Move to upper floors if trapped.'", tasks: [{title: "Broadcast Boil Advisory", priority: "high"}] },
        decision: { reasoning: "Assessing critical infrastructure...", output: "Water treatment plant at risk. Recommend immediate barrier construction around facility.", tasks: [{title: "Protect Water Plant", priority: "high"}] },
        report: { reasoning: "Summarizing rescue operations...", output: "Situation Report: 54 rescues completed. 3 shelters at 80% capacity. Floodwaters expected to peak at 8 PM.", tasks: [{title: "Publish 4PM Update", priority: "low"}] }
    }
};

// Simulation Logic
function createAgentCards() {
    agentGrid.innerHTML = '';
    agents.forEach(agent => {
        const card = document.createElement('div');
        card.className = 'agent-card';
        card.id = `agent-${agent.id}`;
        card.innerHTML = `
            <div class="agent-header">
                <div class="agent-title">
                    <span class="material-symbols-outlined">${agent.icon}</span>
                    ${agent.name}
                </div>
                <div class="agent-status status-idle" id="status-${agent.id}">Idle</div>
            </div>
            <div class="agent-body">
                <div class="agent-reasoning" id="reasoning-${agent.id}">Waiting for input...</div>
                <div class="agent-output" id="output-${agent.id}">-</div>
            </div>
        `;
        agentGrid.appendChild(card);
    });
}

function updateAgent(id, status, reasoning, output) {
    const card = document.getElementById(`agent-${id}`);
    const statusBadge = document.getElementById(`status-${id}`);
    const reasoningEl = document.getElementById(`reasoning-${id}`);
    const outputEl = document.getElementById(`output-${id}`);

    // Update Status
    card.className = 'agent-card';
    statusBadge.className = 'agent-status';
    
    if (status === 'working') {
        card.classList.add('working');
        statusBadge.classList.add('status-working');
        statusBadge.innerHTML = 'Working <span class="loading-dots"></span>';
        reasoningEl.innerHTML = `<span class="material-symbols-outlined" style="font-size:14px; vertical-align:middle; margin-right:4px;">sync</span>${reasoning}`;
        outputEl.innerHTML = '<span class="loading-dots">Generating</span>';
    } else if (status === 'completed') {
        card.classList.add('completed');
        statusBadge.classList.add('status-completed');
        statusBadge.textContent = 'Completed';
        reasoningEl.textContent = "Task accomplished.";
        outputEl.innerHTML = output;
    } else {
        statusBadge.classList.add('status-idle');
        statusBadge.textContent = 'Idle';
    }
}

function addTask(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.priority}`;
    li.innerHTML = `
        <h5>${task.title}</h5>
        <p>Priority: ${task.priority.toUpperCase()}</p>
    `;
    
    // Remove empty state if present
    const emptyState = taskList.querySelector('.empty-state');
    if (emptyState) emptyState.remove();
    
    taskList.prepend(li);
}

// Run Simulation
runScenarioBtn.addEventListener('click', async () => {
    const scenario = scenarioSelect.value;
    const data = scenariosData[scenario];
    
    if (!data) return;

    // Reset UI
    runScenarioBtn.disabled = true;
    createAgentCards();
    taskList.innerHTML = '<li class="empty-state">No active tasks.</li>';
    mapContainer.classList.add('active');
    mapContainer.innerHTML = '<p style="margin-top:200px;">Live Data Feed Active</p>';

    // Agent Cascade Sequence
    const sequence = ['incident', 'resource', 'volunteer', 'communication', 'decision', 'report'];
    
    for (let i = 0; i < sequence.length; i++) {
        const agentId = sequence[i];
        const agentData = data[agentId];
        
        // Start working
        updateAgent(agentId, 'working', agentData.reasoning, '');
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        // Complete working
        updateAgent(agentId, 'completed', '', agentData.output);
        
        // Add tasks to board
        if (agentData.tasks) {
            agentData.tasks.forEach(t => addTask(t));
        }
    }
    
    runScenarioBtn.disabled = false;
});

// Initialize empty agent cards
createAgentCards();
