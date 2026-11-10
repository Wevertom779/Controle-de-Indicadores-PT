
// ELEMENTOS
const iframe = document.getElementById("dashboard-frame");
const pauseBtn = document.getElementById("pause-btn");
const loading = document.getElementById("loading");

const seletor = document.getElementById("report-selector");
const nomeRelatorio = document.getElementById("report-name");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// CONFIGURAÇÕES
const INTERVALO = 120000; // 2 minutos

let pausado = false;
let relatorioAtual = 0;

// RELATÓRIOS
const relatorios = [
    {
        nome: "PRODUTIVIDADE PT",
        url: "https://app.powerbi.com/reportEmbed?reportId=81428cd3-6324-4588-9e94-044930fac3ca&autoAuth=true&ctid=12a3af23-a769-4654-847f-958f3d479f4a"
    },
    {
        nome: "CONTROLE DE PALETE PBR",
        url: "https://app.powerbi.com/reportEmbed?reportId=15f2ab3e-4568-4401-b3f6-321dccc175ee&autoAuth=true&ctid=12a3af23-a769-4654-847f-958f3d479f4a"
    },
    {
       nome: "AAA",
       url: "https://app.powerbi.com/reportEmbed?reportId=2c2ce324-aec6-4f76-a116-b3471c55e643&autoAuth=true&ctid=12a3af23-a769-4654-847f-958f3d479f4a"
    },
    {
       nome: "CONTROLE DE EXPEDIÇÃO PURINA",
       url: "https://app.powerbi.com/reportEmbed?reportId=26efb3a5-6a81-4bde-b2b1-8fe8d7ed82e6&autoAuth=true&ctid=12a3af23-a769-4654-847f-958f3d479f4a"
    },
    {
       nome: "KANBAN TREATS PT",
       url: "https://apps.powerapps.com/play/e/default-12a3af23-a769-4654-847f-958f3d479f4a/a/179d9602-16a8-4828-8476-216c6334aad9?tenantId=12a3af23-a769-4654-847f-958f3d479f4a&hint=30a34223-74fb-4493-b13a-aabc0f18670f&sourcetime=1793801874624"
    }
    
];

// CARREGAR SELETOR
function carregarRelatorios() {

    seletor.innerHTML = "";

    relatorios.forEach((relatorio, index) => {

        const option = document.createElement("option");

        option.value = index;
        option.textContent = relatorio.nome;

        seletor.appendChild(option);

    });

}

// ABRIR RELATÓRIO
function abrirRelatorio(index) {

    if (index < 0 || index >= relatorios.length) return;

    relatorioAtual = index;

    nomeRelatorio.textContent = relatorios[index].nome;
    seletor.value = index;

    atualizarPainel();

}

// ATUALIZAR SOMENTE O RELATÓRIO ATUAL
function atualizarPainel() {

    if (pausado) return;

    loading.style.display = "flex";

    iframe.src = relatorios[relatorioAtual].url;

}

// FINALIZAR CARREGAMENTO
iframe.addEventListener("load", () => {

    loading.style.display = "none";

});

// NAVEGAÇÃO MANUAL
prevBtn.addEventListener("click", () => {

    const novoIndex =
        (relatorioAtual - 1 + relatorios.length) % relatorios.length;

    abrirRelatorio(novoIndex);

});

nextBtn.addEventListener("click", () => {

    const novoIndex =
        (relatorioAtual + 1) % relatorios.length;

    abrirRelatorio(novoIndex);

});

seletor.addEventListener("change", () => {

    abrirRelatorio(Number(seletor.value));

});

// PAUSAR E RETOMAR ATUALIZAÇÃO
pauseBtn.addEventListener("click", () => {

    pausado = !pausado;

    pauseBtn.textContent = pausado ? "RETOMAR" : "PAUSAR";

});

// ATUALIZAÇÃO AUTOMÁTICA A CADA 2 MINUTOS
setInterval(() => {

    if (!pausado) {
        atualizarPainel();
    }

}, INTERVALO);

// WAKE LOCK
let wakeLock = null;

async function manterTelaLigada() {

    if (!("wakeLock" in navigator)) return;

    try {

        if (!wakeLock || wakeLock.released) {
            wakeLock = await navigator.wakeLock.request("screen");
        }

    } catch (erro) {

        console.log("Wake Lock indisponível:", erro);

    }

}

// RECUPERAR WAKE LOCK AO VOLTAR PARA A PÁGINA
document.addEventListener("visibilitychange", () => {

    if (document.visibilityState === "visible") {
        manterTelaLigada();
    }

});

// INICIALIZAÇÃO
carregarRelatorios();

abrirRelatorio(0);

manterTelaLigada();
