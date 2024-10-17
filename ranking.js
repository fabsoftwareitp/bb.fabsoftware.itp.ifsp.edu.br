const host = "https://ranking.fabsoftware.itp.ifsp.edu.br/ranking/bb"

fetch(`${host}`)
  .then(res => res.json())
  .then(res =>  createRankingList(res));

async function createRankingList(rankingJson) {
  const rankingList = document.querySelector(".rankingList");
  let aux = 0;
  rankingJson.sort(function(a, b){return b.score - a.score}); //ordenando
  await rankingJson.forEach(player => {
    const item = createPlayerElement(player);
    rankingList.appendChild(item);
  });
}

function createPlayerElement(player) {
  const element = document.createElement('li');
  element.innerHTML = `<span>${player.name}</span>: <span class="player-score">${player.score}</span>`;
  return element;
}