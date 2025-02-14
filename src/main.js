import './style.css'

document.getElementById("searchBtn").addEventListener("click", fetchClientData);
document.getElementById("clientId").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    fetchClientData();
  }
});

async function fetchClientData() {
  const clientId = document.getElementById("clientId").value;
  const clientName = document.getElementById("clientName");
  const clientSince = document.getElementById("clientSince");
  const clientIdValue = document.getElementById("loyalty-id-value");
  const loyaltyIcons = document.querySelectorAll(".loyaltyIcon");
  const historyTotal = document.querySelector(".history-total");
  const historyList = document.getElementById("appointmentHistory");
  const remainingCuts = document.getElementById("remainingCuts");
  const quantity = document.querySelector(".progress-bar-values .quantity");
  const progressBar = document.querySelector(".progress");
  const content = document.querySelector(".content-wrapper");

  if (!clientId) {
    alert("Por favor, insira um ID válido");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/clients?id=${clientId}`
    );
    const data = await response.json();

    if (data.length === 0) {
      alert("Cliente não encontrado");
    } else {
      const client = data[0];
      clientName.textContent = client.name;
      clientSince.textContent = `Cliente desde ${client.clientSince}`;
      clientIdValue.textContent = `Id: ${client.id}`;

      // Resetando os ícones antes de preencher
      loyaltyIcons.forEach((icon) => icon.classList.remove("check"));

      // Adicionando a classe "check" para o número total de cortes
      for (let i = 0; i < client.loyaltyCard.totalCuts; i++) {
        if (loyaltyIcons[i]) {
          loyaltyIcons[i].classList.add("check");
        }
      }

      // Preenchendo o total de históricos
      historyTotal.textContent = `${client.appointmentHistory.length} cortes`;

      // Preenchendo a lista de histórico
      historyList.innerHTML = "";
      client.appointmentHistory.forEach((appointment) => {
        const listItem = document.createElement("li");

        const dateTimeDiv = document.createElement("div");
        const dateSpan = document.createElement("span");
        dateSpan.classList.add("date");
        dateSpan.textContent = appointment.date;

        const hourSpan = document.createElement("span");
        hourSpan.classList.add("hour");
        hourSpan.textContent = appointment.time;

        dateTimeDiv.appendChild(dateSpan);
        dateTimeDiv.appendChild(hourSpan);

        const checkDiv = document.createElement("div");
        const checkSpan = document.createElement("span");
        checkSpan.classList.add("check");
        checkDiv.appendChild(checkSpan);

        listItem.appendChild(dateTimeDiv);
        listItem.appendChild(checkDiv);

        historyList.appendChild(listItem);
      });

      // Atualizando o número de cortes restantes
      remainingCuts.textContent = client.loyaltyCard.cutsRemaining;

      // Atualizando a quantidade de cortes feitos e necessários
      quantity.textContent = `${client.loyaltyCard.totalCuts} de ${client.loyaltyCard.cutsNeeded}`;

      // Atualizando a barra de progresso
      const progressPercentage =
        (client.loyaltyCard.totalCuts / client.loyaltyCard.cutsNeeded) * 100;
      progressBar.style.width = `${progressPercentage}%`;

      content.classList.remove("hidden");
    }
  } catch (error) {
    alert("Erro ao buscar dados.");
    console.error(error);
  }
}
