const host = "https://ranking.fabsoftware.itp.ifsp.edu.br/ranking/bb"
let rankingData = null;

async function getRanking() {
  await fetch(`${host}`)
    .then(res => res.json())
    .then(res =>  createRankingList(res));
}

function createRankingList(rankingJson) {
  rankingData = rankingJson;
  const rankingList = document.querySelector(".rankingList");
  rankingList.innerHTML = null;
  let aux = 0;
  rankingJson.sort(function(a, b){return b.score - a.score}); //ordenando
  const top10players = rankingJson.slice(0, 10);
  top10players.forEach(player => {
    const item = createPlayerElement(player);
    rankingList.appendChild(item);
  });
}

function createPlayerElement(player) {
  const element = document.createElement('li');
  element.innerHTML = `<span>${player.name}</span>: <span class="player-score">${player.score}</span>`;
  return element;
}

getRanking();