const maleColour = '#00ceae';
const femaleColour = '#ffa300';
const unknownColour = '#6FC24D';
const noPBColour = '#95D03A';
const firstEverColour = '#8e5ea2';
const firstTimeHereColour = '#e21145';
const beenBeforeColour = '#00ADEF';

const milestoneOne ='#8e5ea2';
const milestoneTen ='#ffffffb6';
const milestoneTwentyFive = '#523585';
const milestoneFifty = '#C92E2E';
const milestoneHundred = '#222222';
const milestoneTwoFifty = '#394A36';
const milestoneFiveHundred = '#0162BA';
const milestoneThousand = '#E5C500';

const juniorMilestoneHalfMarathon = '#99d6ea';
const juniorMilestoneMarathon = '#c1cc26';
const juniorMilestoneUltra = '#ffa300';
const juniorMilestoneHundred = '#939393';
const juniorMilestoneTwoFifty = '#ffdd00';

const underTwentyColour = '#6FC24D';
const twentyToThirtyNineColour = '#00ADEF';
const fortyToFiftyNineColour = '#E5C500';
const sixtyToSeventyNineColour = '#8e5ea2';
const eightyPlusColour = '#99d6ea';

function createVolunteers(target, meta) {
  const viz = chrome.runtime.getURL('src/i/hiviz.svg');
  const div = document.createElement('div');
  div.id = 'volunteers';
  div.classList.add('volunteer-banner');
  div.innerHTML = `<img alt="A hi-viz vest" src="${viz}"> Thank you to our ${meta.volunteerMeta.totalVols} volunteers who made this event possible!`;
  target.append(div);
}


function createGroup(target, id) {
  const group = document.createElement('div');
  group.id = id;
  group.classList.add('group');
  target.append(group);
  return group;
}


function createGenderDonut(target, meta) {
  const participants = meta.genders.male + meta.genders.female + meta.genders.unknown;
  const config = {
    id: 'gender-donut',
    message: `<h1>${participants}</h1><p>Participants</p>`,
    raw: [
      { label: 'Male', value: meta.genders.male, color: maleColour },
      { label: 'Female', value: meta.genders.female , color: femaleColour },
      { label: 'Unknown', value: meta.genders.unknown , color: unknownColour },
    ].sort((a, b) => b.value - a.value)  // Sort descending by value
  };
  createDonut(target, config);
}


function createFirstDonut(target, meta) {
  const participants = meta.genders.male + meta.genders.female + meta.genders.unknown;
  const firsts = meta.first.here + meta.first.anywhere;
  const config = {
    id: 'first-donut',
    message: `<h1>${firsts}</h1><p>First Timers</p><p>${Number(firsts / participants * 100).toFixed(1)}% of participants</p>`,
    raw: [
      { label: 'First ever!', value: meta.first.anywhere, color: firstEverColour },
      { label: 'First time here', value: meta.first.here, color: firstTimeHereColour },
      { label: 'Participated here before', value: participants - firsts, color: beenBeforeColour },
    ].sort((a, b) => b.value - a.value)  // Sort descending by value
  };
  createDonut(target, config);
}


function createPBDonut(target, meta) {
  const participants = meta.genders.male + meta.genders.female + meta.genders.unknown;
  const pbs = meta.pb.male + meta.pb.female + meta.pb.unknown;
  const config = {
    id: 'donut-pb',
    message: `<h1>${pbs}</h1><p>Personal Bests</p><p>${Number(pbs / participants * 100).toFixed(1)}% of participants</p>`,
    raw: [
      { label: 'Male PB', value: meta.pb.male, color: maleColour },
      { label: 'Female PB', value: meta.pb.female, color: femaleColour },
      { label: 'No PB', value: participants - pbs, color: noPBColour },
    ].sort((a, b) => b.value - a.value)  // Sort descending by value
  };
  createDonut(target, config);
}


function createMilestonesDonut(target, meta) {
  const config = {
    id: 'dmilestones',
    message: `<h1>${meta.milestones.total}</h1><p style="text-align: center">Participant<br>milestones<br>achieved!</p>`,
    raw: isForJuniors()
      ? [
          { label: 'Half marathon (11)', value: meta.milestones.official[11].length, color: juniorMilestoneHalfMarathon },
          { label: 'Marathon (21)', value: meta.milestones.official[21].length, color: juniorMilestoneMarathon },
          { label: 'Ultra marathon (50)', value: meta.milestones.official[50].length, color: juniorMilestoneUltra },
          { label: '100', value: meta.milestones.official[100].length, color: juniorMilestoneHundred },
          { label: '250', value: meta.milestones.official[250].length, color: juniorMilestoneTwoFifty },
        ]
      : [
          { label: '10 (under 18\'s)', value: meta.milestones.official[10].length, color: milestoneTen },
          { label: '25', value: meta.milestones.official[25].length, color: milestoneTwentyFive },
          { label: '50', value: meta.milestones.official[50].length, color: milestoneFifty },
          { label: '100', value: meta.milestones.official[100].length, color: milestoneHundred },
          { label: '250', value: meta.milestones.official[250].length, color: milestoneTwoFifty },
          { label: '500', value: meta.milestones.official[500].length, color: milestoneFiveHundred },
          { label: '1K', value: meta.milestones.official[1000].length, color: milestoneThousand },
        ],
    borderColor: '#fff',
  };
  createDonut(target, config);
}
function addMilestonesMissingText(target) {
  const milestoneText = document.createElement('p');
  milestoneText.style.textAlign = 'center';
  milestoneText.innerHTML = `Milestone data is not valid for past result pages<br />as the finishes count is always current.`;
  target.append(milestoneText);
}


function createVolunteersDonut(target, meta) {
  const config = {
    id: 'dvolunteers',
    message: `<h1>${meta.volunteerMeta.milestones.total}</h1><p style="text-align: center">Volunteer<br>milestones<br>achieved!</p>`,
    raw : [
          { label: 'First timer', value: meta.volunteerMeta.milestones[1].length, color: milestoneOne },
          { label: '25', value: meta.volunteerMeta.milestones[25].length, color: milestoneTwentyFive },
          { label: '50', value: meta.volunteerMeta.milestones[50].length, color: milestoneFifty },
          { label: '100', value: meta.volunteerMeta.milestones[100].length, color: milestoneHundred },
          { label: '250', value: meta.volunteerMeta.milestones[250].length, color: milestoneTwoFifty },
          { label: '500', value: meta.volunteerMeta.milestones[500].length, color: milestoneFiveHundred },
          { label: '1K', value: meta.volunteerMeta.milestones[1000].length, color: milestoneThousand },
        ],
    borderColor: '#fff',
  };
  createDonut(target, config);
}


function createAgeGroupDonut(target, meta) {
  if (isForJuniors()) {
    const config = {
      id: 'dagegroup',
      message: `<p style="text-align: center">Age range</p>`,
      raw : [
            { label: 'under 11', value: meta.ageGroup[10], color: firstEverColour },
            { label: '11-14', value: meta.ageGroup[1114], color: fortyToFiftyNineColour },
          ],
      borderColor: '#fff',
    };
    createDonut(target, config);
  }
  else {
    const config = {
      id: 'dagegroup',
      message: `<p style="text-align: center">Age range</p>`,
      raw : [
            { label: 'under 20', value: meta.ageGroup[10] + meta.ageGroup[1114] + meta.ageGroup[1517] + meta.ageGroup[1819], color: underTwentyColour },
            { label: '20-39', value: meta.ageGroup[2024] + meta.ageGroup[2529] + meta.ageGroup[3034] + meta.ageGroup[3539], color: twentyToThirtyNineColour },
            { label: '40-59', value: meta.ageGroup[4044] + meta.ageGroup[4549] + meta.ageGroup[5054] + meta.ageGroup[5559], color: fortyToFiftyNineColour },
            { label: '60-79', value: meta.ageGroup[6064] + meta.ageGroup[6569] + meta.ageGroup[7074] + meta.ageGroup[7579], color: sixtyToSeventyNineColour },
            { label: '80+', value: meta.ageGroup[8084] + meta.ageGroup[8589] + meta.ageGroup[9094] + meta.ageGroup[9599], color: eightyPlusColour },
          ],
      borderColor: '#fff',
    };
    createDonut(target, config);
  }
}

function createDonut(target, config) {
  const fig = document.createElement('figure');
  fig.id = config.id;
  fig.classList.add('donut');
  const cap = document.createElement('figcaption');
  cap.innerHTML = config.message;
  fig.append(cap);
  const canvas = document.createElement('canvas');
  fig.append(canvas);
  target.append(fig);

  const key = document.createElement('div');
  key.classList.add('key');
  fig.append(key);

  // Prepare the data for the chart
  const data = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
    }],
  };
  
  // add data from raw to the chart
  for (const item of config.raw) {
    if (item.value != 0) {
      data.labels.push(item.label);
      data.datasets[0].data.push(item.value);
      data.datasets[0].backgroundColor.push(item.color);
    }
  }

  addLegendToKey(key, data);

  // Prepare the options for the chart
  const options = {
    color: '#fff',
    cutout: "65%",
    borderColor: config.borderColor ?? '#fff',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        textStrokeColor: 'black',
        textStrokeWidth: 4,
        color: 'white',
        labels: {
          value: {
            font: {
              size: '24px',
              weight: 'bold',
            },
          },
        },
      },
    },
  };

  // Create a new Chart.js instance
  const chart = new Chart(canvas, {
    type: 'doughnut',
    data,
    options,
  });
}


function extractFinishers() {
  const table = document.querySelector('table.Results-table');
  const rows = table.querySelectorAll('.Results-table-row');
  const finishers = [];

  for (const row of rows) {
    const result = extractFinisherRow(row);
    if (result) finishers.push(result);
  }

  return finishers;
}


function extractFinisherRow(row) {
  const result = {};

  // Extract data attributes
  if (row.dataset.name) {
    result.name = row.dataset.name;
    result.ageGroup = row.dataset.agegroup;
    result.gender = row.dataset.gender;
    result.runs = row.dataset.runs;
    result.achievement = row.dataset.achievement;
  }

  return result;
}


function extractVolunteers() {
  const table = document.querySelector('table.Volunteers-table');
  const rows = table.querySelectorAll('.Volunteers-table-row');
  const volunteers = [];

  for (const row of rows) {
    const result = extractVolunteerRow(row);
    if (result) volunteers.push(result);
  }

  return volunteers;
}


function extractVolunteerRow(row) {
  const result = {};

  // Extract data attributes
  if (row.dataset.name) {
    result.name = row.dataset.name;
    result.volunteerCredits = row.dataset.volunteercredits;
  }

  return result;
}


function createInfographicElement() {
  let infographic = document.querySelector('#infographic');
  if (infographic) return;

  const header = document.querySelector('.Results-header');
  if (header) {
    infographic = document.createElement('div');
    infographic.id = 'infographic';
    infographic.innerHTML = '<code>Preparing Charts....</code>';
    header.before(infographic);

    // let p = document.createElement('p');
    // p.id = 'linkToChromeExtension';
    // p.innerHTML = 'Infographic made with the <a href="https://chromewebstore.google.com/detail/parkrun-event-summary/nfdbgfodockojbhmenjohphggbokgmaf">parkrun Event Summary</a> Chrome extension.';
    // header.before(p);
  }

  return infographic;
}


function createTitle(target) {
  const header = document.createElement('header');
  header.classList.add('event-location');

  const rhh1 = document.querySelector('.Results-header h1');
  const parkrunName = rhh1.textContent.trim();

  const rhspans = document.querySelectorAll('.Results-header span');
  const parkrunNumber = [...rhspans].at(-1).textContent.trim();

  const h1 = document.createElement('h1');
  h1.textContent = `${parkrunName} ${parkrunNumber}`;

  header.append(h1);
  target.append(header);
}


function createDate(target) {
  const header = document.createElement('div');
  header.classList.add('event-date');

  const h1 = document.createElement('h1');
  const d = document.querySelector('span.format-date');
  h1.textContent = d.textContent.trim();

  header.append(h1);
  target.append(header);
}


function generateInfographic(meta) {
  const infographic = document.querySelector('#infographic');
  infographic.innerHTML = '';
  
  const ghead = createGroup(infographic, 'ghead'); 
  createTitle(ghead);
  createDate(ghead);
  createVolunteers(infographic, meta); // 👈 appended to infographic, between ghead and gcharts
  const gcharts = createGroup(infographic, 'gcharts'); 

  createGenderDonut(gcharts, meta);
  createPBDonut(gcharts, meta);
  createFirstDonut(gcharts, meta);
  
  if (meta.milestones.total > 0 && isLastestResultsPage())
    createMilestonesDonut(gcharts, meta);

  createAgeGroupDonut(gcharts, meta);

   if (meta.volunteerMeta.milestones.total > 0 && isLastestResultsPage())
    createVolunteersDonut(gcharts, meta);

   if (!isLastestResultsPage()) 
    addMilestonesMissingText(gcharts);
}


function simplify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}


function extractMeta(finishers) {
  const meta = {};
  meta.genders = { male: 0, female: 0, unknown: 0 };
  meta.achievement = {};
  meta.ageGroups = {};
  meta.runs = {};
  meta.first = { here: 0, anywhere: 0 };
  meta.pb = { male: 0, female: 0, unknown: 0 };
  meta.milestones = {};
  meta.milestones.junior = { 11: [], 21: [], 50: [], 100: [], 250: [] };
  meta.milestones.fiveK = { 10: [], 25: [], 50: [], 100: [], 250: [], 500: [], 1000: [] };
  meta.milestones.unofficial = { 150: [], 200: [], 300: [], 400: [], 600: [], 700: [], 800: [], 900: [] };
  meta.milestones.total = 0;
  meta.ageGroup = { 10: 0, 1114: 0, 1517: 0, 1819: 0, 2024: 0, 2529: 0, 3034: 0, 3539: 0, 4044: 0, 4549: 0, 5054: 0, 5559: 0, 6064: 0, 6569: 0, 7074: 0, 7579: 0, 8084: 0, 8589: 0, 9094: 0, 9599: 0 };

  const genderTerms = {
    female: ["Female", "Kvinna", "Kvinde", "Kobieta", "Femme", "Frau", "Weiblich", "Naiset", "Vrouw", "Nainen", "Donna", "女子", "Kobieta", "Kvinne", "Moteris"],
    male: ["Male", "Man", "Mann", "Mand", "Männlich", "Homme", "Miehet", "Mężczyzna", "男子", "Vyras"]
  };

  for (const finisher of finishers) {

    if (finisher.gender) {
      if (genderTerms.male.includes(finisher.gender)) {
        meta.genders.male++;
        finisher.gender = "male";
      } else if (genderTerms.female.includes(finisher.gender)) {
        meta.genders.female++; 
        finisher.gender = "female";
      } else {
        meta.genders.unknown++;
        finisher.gender = "unknown";
      }
    } else {
      meta.genders.unknown++;
      finisher.gender = "unknown";
    }

    if (finisher.achievement) {
      meta.achievement[finisher.achievement] = (meta.achievement[finisher.achievement] ?? 0) + 1;

      const firstTimer = ["First Timer!", "Første gang!", "Erstteilnahme!", "Première perf' !", "Erstläufer!", "Nieuwe loper!", "Ensikertalainen!", "Prima volta!", "初参加!", "Debiutant", "Debut!", "Naujokas!"];
      const newPB = ["New PB!", "Neue PB!", "Meilleure perf' !", "Nieuw PR!", "Ny PB!", "Oma ennätys!", "Nuovo PB!", "自己ベスト!", "Nowy PB!", "Nytt PB!", "Naujas geriausias asmeninis rezultatas!"];

      // uk, at, de, nl, dk, fi, fr, jp, no, pl, se

      if (firstTimer.includes(finisher.achievement)) {
        if (finisher.runs === '1' && isLastestResultsPage()) {
          meta.first.anywhere++;
        } else {
          meta.first.here++;
        }
      }

      if (newPB.includes(finisher.achievement)) {
        meta.pb[finisher.gender] = meta.pb[finisher.gender] + 1 ?? 1;
      }
    }
    if (finisher.ageGroup) {
      meta.ageGroups[finisher.ageGroup] = (meta.ageGroups[finisher.ageGroup] ?? 0) + 1;

      const ageGroupKey = finisher.ageGroup.replace(/^[A-Z]+/, '').replace('-', '');
      if (meta.ageGroup[ageGroupKey] !== undefined) {
        meta.ageGroup[ageGroupKey]++;
      }      
    }
    if (finisher.runs) {
      meta.milestones.official = isForJuniors()
        ? meta.milestones.junior
        : meta.milestones.fiveK;
      if (meta.milestones.official[finisher.runs]) {
        // Only add milestone 10 if it's a junior (ageGroup starts with J)
        if (finisher.runs === '10' && !finisher.ageGroup?.startsWith('J')) {
          // Skip non-juniors for milestone 10
        } else {
          meta.milestones.official[finisher.runs].push(finisher.name);
          meta.milestones.total++;
        }
      }
      if (meta.milestones.unofficial[finisher.runs]) {
        meta.milestones.unofficial[finisher.runs].push(finisher.name);
      }
    }
  }
 
  return meta;
}


function extractVolunteersMeta(volunteers) {
  const meta = {};
  meta.milestones = { 1: [], 25: [], 50: [], 100: [], 250: [], 500: [], 1000: [] };
  meta.milestones.total = 0;

  for (const volunteer of volunteers) {
    if (volunteer.volunteerCredits) {
      if (meta.milestones[volunteer.volunteerCredits]) {
        meta.milestones[volunteer.volunteerCredits].push(volunteer.name);
        meta.milestones.total++;
      }
    }
  }
  meta.totalVols = volunteers.length;

  return meta;
}


function start() {
  Chart.register(ChartDataLabels);
  Chart.defaults.set('plugins.datalabels', {
    color: '#FFFFFF',
  });

  const finishers = extractFinishers();
  const meta = extractMeta(finishers);
  const volunteers = extractVolunteers();
  const volunteerMeta = extractVolunteersMeta(volunteers);
  meta.finishers = finishers;
  meta.volunteers = volunteers;
  meta.volunteerMeta = volunteerMeta;
  generateInfographic(meta);
}


function isValidResultsPage() {
  const url = String(window.location.href);

  const isLatestResultsPage = url.includes('/latestresults');
  const isDateResultsPage = /\/results\/\d{4}-\d{2}-\d{2}\//.test(url);
  const isPreviousResultsPage = /\/results\/\d+\//.test(url);
  const isResultsPage = isLatestResultsPage || isDateResultsPage || isPreviousResultsPage;

  return isResultsPage;
}


function delayedStart() {
  if (!isValidResultsPage()) { return; }

  if (document.title.includes('Human')) {
    // try and get a handle on the results header so we can
    // add a loading message
    const header = document.querySelector('.Results-header');
    if (header) {
      createInfographicElement();
    }
    setTimeout(delayedStart, 5);
  } else {
    createInfographicElement();
    start();
  }
}


function addLegendToKey(key, data) {
  data.labels.forEach((label, index) => {
    const legendItem = document.createElement('div');
    legendItem.style.backgroundColor = data.datasets[0].backgroundColor[index];
    legendItem.textContent = label;
    key.append(legendItem);
  });
}


function isForJuniors() {
  return window.location.href.includes('-juniors/');
}

function isLastestResultsPage() {
  const url = String(window.location.href);
  const isDateResultsPage = /\/results\/\d{4}-\d{2}-\d{2}\//.test(url);
  return isDateResultsPage;
}

window.onload = delayedStart;