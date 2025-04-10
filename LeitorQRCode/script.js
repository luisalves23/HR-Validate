let conteudoQRCode = ""; // Variável para armazenar o conteúdo do QR Code

// Lista de convidados (nomes)
let listaDeConvidados = ["Erick Silva"];

// Lista para armazenar os QR Codes já escaneados
let qrCodesEscaneados = [];

// Função para inicializar a câmera e começar a leitura do QR Code
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    const video = document.getElementById("video");
    video.srcObject = stream;
    video.play();

    // Inicia a leitura do QR Code
    requestAnimationFrame(scanQRCode);
  } catch (err) {
    console.error("Erro ao acessar a câmera: ", err);
  }
}

// Função para escanear o QR Code
function scanQRCode() {
  const video = document.getElementById("video");
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    // Ajusta o tamanho do canvas de acordo com o vídeo
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;

    // Desenha o vídeo no canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Captura os dados da imagem no canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Usando a biblioteca jsQR para detectar QR Codes
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
      // Armazena o conteúdo do QR Code
      conteudoQRCode = code.data.trim();

      // Exibe o conteúdo do QR Code no <h2>
      document.getElementById("conteudo-h2").style.display = "block";
      document.getElementById(
        "conteudo-h2"
      ).textContent = `QR Code lido: ${conteudoQRCode}`;

      // Exibe o botão para verificar duplicidade
      document.getElementById("verificar-duplicidade").style.display = "block";
    }
  }

  // Chama novamente a função para continuar escaneando
  requestAnimationFrame(scanQRCode);
}

// Função para verificar duplicidade
function verificarDuplicidade() {
  // Verifica se o QR Code já foi escaneado antes
  if (qrCodesEscaneados.includes(conteudoQRCode)) {
    // Altera o fundo da página para vermelho (QR já escaneado)
    document.body.style.backgroundColor = "#FF7043"; // Cor de erro

    // Exibe a div flutuante com a mensagem de erro
    const flutuante = document.getElementById("flutuante");
    flutuante.style.display = "block";
    flutuante.style.backgroundColor = "#FF7043"; // Cor de erro
    document.getElementById(
      "conteudo"
    ).textContent = `QR Code lido com sucesso: ${conteudoQRCode}. Já foi escaneado antes!`;
  } else {
    // Verifica se o nome lido está na lista de convidados
    if (listaDeConvidados.includes(conteudoQRCode)) {
      // Altera o fundo da página para verde (QR válido)
      document.body.style.backgroundColor = "#4CAF50"; // Cor de sucesso

      // Exibe a div flutuante com a mensagem de sucesso
      const flutuante = document.getElementById("flutuante");
      flutuante.style.display = "block";
      flutuante.style.backgroundColor = "#4CAF50"; // Cor de sucesso
      document.getElementById(
        "conteudo"
      ).textContent = `QR Code lido com sucesso: ${conteudoQRCode}. Convidado encontrado!`;

      // Adiciona o QR Code à lista de escaneados
      qrCodesEscaneados.push(conteudoQRCode);
    } else {
      // Altera o fundo da página para vermelho (QR inválido)
      document.body.style.backgroundColor = "#FF7043"; // Cor de erro

      // Exibe a div flutuante com a mensagem de erro
      const flutuante = document.getElementById("flutuante");
      flutuante.style.display = "block";
      flutuante.style.backgroundColor = "#FF7043"; // Cor de erro
      document.getElementById(
        "conteudo"
      ).textContent = `QR Code lido com sucesso: ${conteudoQRCode}. Convidado não encontrado!`;
    }
  }

  // Após verificar, esconde o botão de duplicidade novamente
  document.getElementById("verificar-duplicidade").style.display = "none";
}

// Inicia a câmera assim que a página for carregada
window.onload = initCamera;
