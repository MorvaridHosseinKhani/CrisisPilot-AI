// DOM Elements
const scenarioSelector = document.getElementById('scenario-selector');
const btnRun = document.getElementById('btn-run');
const mapView = document.getElementById('map-view');
const directivesBody = document.getElementById('directives-body');
const agentPipeline = document.getElementById('agent-pipeline');

// KPIs
const kpiAssets = document.getElementById('kpi-assets');
const kpiVolunteers = document.getElementById('kpi-volunteers');

const agents = [
    { id: 'coordinator', name: 'Coordinator Agent', icon: 'hub' },
    { id: 'incident', name: 'Incident Analysis', icon: 'emergency' },
    { id: 'resource', name: 'Resource Allocation', icon: 'local_shipping' },
    { id: 'volunteer', name: 'Volunteer Coordination', icon: 'groups' },
    { id: 'comms', name: 'Communications', icon: 'campaign' },
    { id: 'decision', name: 'Decision Support', icon: 'psychology' },
    { id: 'report', name: 'Situation Report', icon: 'insert_chart' }
];

const scenarioData = {
    earthquake: {
        coordinator: {
            log: "> Initializing Operation: Tremor Response.\n> Dispatching telemetry data to Incident Analysis...",
            delay: 1000
        },
        incident: {
            log: "> Ingesting USGS API data...\n> Magnitude: 7.2\n> Epicenter: 34.05,-118.24\n> Structural damage estimated at 42% in Sector Alpha.",
            tasks: [
                { priority: 'high', title: 'Dispatch Structural Assessment Drones', agent: 'Incident Analysis' }
            ],
            delay: 1500
        },
        resource: {
            log: "> Scanning local inventory buffers...\n> Allocated: 12 Heavy Extractors\n> Allocated: 4000L IV Fluids\n> Rerouting supply trucks to safe zones.",
            tasks: [
                { priority: 'high', title: 'Route Heavy Extractors to Sector Alpha', agent: 'Resource Allocation' },
                { priority: 'med', title: 'Establish Triage Tent at City Park', agent: 'Resource Allocation' }
            ],
            metrics: { assets: 142 },
            delay: 1200
        },
        volunteer: {
            log: "> Querying active volunteer DB...\n> Match found: 45 Medical, 120 Logistics.\n> Pushing deployment coordinates to mobile apps.",
            tasks: [
                { priority: 'med', title: 'Deploy Volunteer Squad Alpha (Med)', agent: 'Volunteer Coordination' }
            ],
            metrics: { volunteers: 165 },
            delay: 1000
        },
        comms: {
            log: "> Generating multilingual payload...\n> Translating to ES, ZH, KO.\n> Dispatching via Cellular Broadcast Protocol.",
            tasks: [
                { priority: 'high', title: 'Issue Tier 1 Evac Warning (Cell Broadcast)', agent: 'Communications' }
            ],
            delay: 1500
        },
        decision: {
            log: "> Computing constraints and bottleneck matrix...\n> Warning: Route 4 bridge structural failure imminent.\n> Suggested action: Divert all traffic to Highway 101.",
            tasks: [
                { priority: 'high', title: 'Divert Traffic - Close Route 4', agent: 'Decision Support' }
            ],
            delay: 1800
        },
        report: {
            log: "> Compiling executive payload...\n> Generating PDF and data-vis charts...\n> Transmission to Command HQ successful.",
            tasks: [
                { priority: 'low', title: 'Distribute 14:00 Hourly Briefing', agent: 'Situation Report' }
            ],
            delay: 1000
        }
    },
    hurricane: {
        coordinator: { log: "> Initializing Operation: Coastal Shield.\n> Activating weather grid trackers...", delay: 800 },
        incident: { log: "> Windspeed: 165mph. Storm surge: 12ft predicted.\n> Coastal flooding imminent.", tasks: [{priority:'high', title:'Trigger Coastal Sirens', agent:'Incident Analysis'}], delay: 1200 },
        resource: { log: "> Unlocking municipal sandbag reserves.\n> Deploying 15 High-water rescue vehicles.", tasks: [{priority:'high', title:'Deploy High-water Vehicles', agent:'Resource Allocation'}], metrics: { assets: 85 }, delay: 1000 },
        volunteer: { log: "> Mobilizing shelter management volunteers.\n> 40 personnel dispatched to High School B.", tasks: [{priority:'med', title:'Staff Emergency Shelter B', agent:'Volunteer Coordination'}], metrics: { volunteers: 40 }, delay: 1000 },
        comms: { log: "> Drafting mandatory evacuation notices.", tasks: [{priority:'high', title:'Broadcast Evac Notice', agent:'Communications'}], delay: 1000 },
        decision: { log: "> Simulating surge trajectory...\n> Power grid sub-station 4 at risk of inundation.", tasks: [{priority:'high', title:'Preemptive Power Cut (Sector 4)', agent:'Decision Support'}], delay: 1500 },
        report: { log: "> Dashboard updated. Surge models attached.", tasks: [], delay: 800 }
    },
    wildfire: {
        coordinator: { log: "> Initializing Operation: Inferno Containment.", delay: 800 },
        incident: { log: "> Satellite thermography confirms 4,000 acre burn.\n> Wind shifting North at 25mph.", tasks: [{priority:'high', title:'Update Fire Boundary Map', agent:'Incident Analysis'}], delay: 1200 },
        resource: { log: "> Requesting aerial retardant drops (2x C-130s).", tasks: [{priority:'high', title:'Approve Aerial Drop', agent:'Resource Allocation'}], metrics: { assets: 12 }, delay: 1000 },
        volunteer: { log: "> Mobilizing animal rescue teams.", tasks: [{priority:'med', title:'Evacuate County Shelter', agent:'Volunteer Coordination'}], metrics: { volunteers: 25 }, delay: 1000 },
        comms: { log: "> Issuing smoke/air-quality warnings.", tasks: [{priority:'med', title:'Issue AQI Alert', agent:'Communications'}], delay: 1000 },
        decision: { log: "> Evacuation route I-5 is bottlenecking. Reroute via Route 99.", tasks: [{priority:'high', title:'Implement Traffic Diversion', agent:'Decision Support'}], delay: 1500 },
        report: { log: "> Containment at 14%. Summary dispatched.", tasks: [], delay: 800 }
    }
};

// UI Interactions
scenarioSelector.addEventListener('change', () => {
    btnRun.disabled = false;
});

function getPriorityClass(p) {
    if(p === 'high') return 'tag-high';
    if(p === 'med') return 'tag-med';
    return 'tag-low';
}

function initPipeline() {
    agentPipeline.innerHTML = '';
    agents.forEach(agent => {
        const node = document.createElement('div');
        node.className = 'agent-node';
        node.id = `node-${agent.id}`;
        node.innerHTML = `
            <div class="node-icon"><span class="material-symbols-outlined">${agent.icon}</span></div>
            <div class="node-content">
                <div class="node-header">
                    <span class="node-title">${agent.name}</span>
                    <span class="node-time" id="time-${agent.id}">--:--:--</span>
                </div>
                <div class="node-console" id="console-${agent.id}">Awaiting initialization...</div>
            </div>
        `;
        agentPipeline.appendChild(node);
    });
}

function appendTask(task) {
    const emptyRow = document.querySelector('.empty-row');
    if(emptyRow) emptyRow.remove();

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><span class="priority-tag ${getPriorityClass(task.priority)}">${task.priority}</span></td>
        <td style="font-weight: 500;">${task.title}</td>
        <td style="color: var(--text-secondary);">${task.agent}</td>
        <td><span class="text-amber">PENDING</span></td>
    `;
    directivesBody.prepend(tr);
}

function generateMapPings() {
    mapView.innerHTML = ''; // clear
    mapView.classList.add('active');
    
    // Add a few random pings
    for(let i=0; i<5; i++) {
        const ping = document.createElement('div');
        ping.className = 'radar-ping';
        ping.style.top = Math.floor(Math.random() * 80 + 10) + '%';
        ping.style.left = Math.floor(Math.random() * 80 + 10) + '%';
        mapView.appendChild(ping);
    }
}

btnRun.addEventListener('click', async () => {
    const scenario = scenarioSelector.value;
    const data = scenarioData[scenario];
    if(!data) return;

    btnRun.disabled = true;
    directivesBody.innerHTML = '';
    kpiAssets.textContent = "0";
    kpiVolunteers.textContent = "0";
    
    initPipeline();
    generateMapPings();

    const now = new Date();

    for(let i=0; i<agents.length; i++) {
        const agent = agents[i];
        const stepData = data[agent.id];
        const node = document.getElementById(`node-${agent.id}`);
        const consoleEl = document.getElementById(`console-${agent.id}`);
        const timeEl = document.getElementById(`time-${agent.id}`);

        // Set Active
        node.classList.add('active');
        consoleEl.textContent = "> Processing...";
        consoleEl.classList.add('text-blue');
        
        await new Promise(r => setTimeout(r, stepData.delay));

        // Complete step
        node.classList.remove('active');
        node.classList.add('completed');
        
        const timestamp = new Date(now.getTime() + (i * 1500));
        timeEl.textContent = timestamp.toTimeString().split(' ')[0] + "." + Math.floor(Math.random()*999);
        
        consoleEl.classList.remove('text-blue');
        consoleEl.innerHTML = `<span class="typewriter-text">${stepData.log.replace(/\n/g, '<br>')}</span>`;

        // Update KPIs
        if(stepData.metrics) {
            if(stepData.metrics.assets) kpiAssets.textContent = stepData.metrics.assets;
            if(stepData.metrics.volunteers) kpiVolunteers.textContent = stepData.metrics.volunteers;
        }

        // Add tasks
        if(stepData.tasks) {
            stepData.tasks.forEach(t => appendTask(t));
        }
    }

    btnRun.disabled = false;
});

// Initial Setup
initPipeline();
