var types = [
    "image/jpg",
    "image/jpeg",
    "image/bmp",
    "image/png"
]

var infoAfter = document.getElementById("infoNew");
var infoBefore = document.getElementById("infoOrigin");

//aqui é onde definimos as dimensões máximas da nova imagem
var MAX_WIDTH = 640;
var MAX_HEIGHT = 640;

//aqui personalizamos o que queremos fazer com a imagem convertida
const callback = (image, id) => {
    //pegando o endereço temporário da nova imagem
    const src = URL.createObjectURL(image);
    //criando a variável para setar a nova imagem e exibir para o usuário
    const preview = document.getElementById(id);
    //setando o caminho da imagem redimensionada na imagem que será exibida para o usuário
    preview.src = src;
    id === "origin" ? infoBefore.innerHTML = `${image.name} - ${(image.size / 1024 / 1024).toFixed(2)} Mb` : infoAfter.innerHTML = `${image.name} - ${(image.size / 1024 / 1024).toFixed(2)} Mb`;
};

//Função chamada após a seleção da imagem
function handleOnChange() {
    //criamos uma variável com os arquivos selecionados do input
    const files = document.getElementById("files").files;
    //verificamos se foi selecionado algum arquivo e fazemos um return caso negativo
    if (files.lentgh === 0) {
        alert("Não foram selecionadas imagens.");
        return;
    } else if (files.lentgh > 1) {
        alert("Permitido apenas uma compactação por vez.");
        return;
    } else if (!types.includes(files[0].type.toString())) {
        console.log(files[0].type);
        alert("Extensão não permitida.");
        return;
    }
    callback(files[0], "origin");
    resize(files[0]);
};

function resize(image) {
    //criamos img que será a nossa nova imagem
    const img = new Image();
    //criamos um reader para ler a nossa imagem
    const reader = new FileReader();
    //salvamos uma função de callback que será chamada quando o canvas converter o arquivo para blob
    const createFileFromBlob = blob => {
        //criamos um file com o blob passando o nome da imagem, o tipo e a ultima modificação
        const imageResized = new File(
            [blob],
            image.name,
            {
                type: image.type,
                lastModified: Date.now()
            }
        );
        //Chamando a função definida no inicio, que será a função para utilizar a foto compactada
        callback(imageResized, "newImage");
    };

    //vamos escrever o método do onload do reader porque ele é chamado no momento em que é finalizado a carregamento da imagem
    reader.onload = e => {
        img.src = e.target.result;
        //quando a imagem fora carregada após receber o a linha superior
        img.onload = () => {
            //criamos um canvas
            const canvas = document.createElement("canvas");
            //fazemos calculos para saber qual lado é maior e reduzir na propoção certa
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            //definimos tamanho do canvas com as dimensões reduzidas
            canvas.width = width;
            canvas.height = height;
            //pegamos o contexto do canvas
            let ctx = canvas.getContext("2d");
            //desenhamos a nova imagem passando a imagem, a posição de inicio e o tamanho
            ctx.drawImage(img, 0, 0, width, height);
            //aqui é onde a magia acontece,
            //primeiro convertemos a imagem desenhada pelo canvas para o formato Blob
            //o primeiro parametro é a função de callback que ele irá chamar após converter
            //o segundo o type da imagem
            //e o terceiro é a qualidade variando de 0 a 1
            ctx.canvas.toBlob(createFileFromBlob, image.type, 0.8);
        };
    };
    //aqui lemos a imagem
    reader.readAsDataURL(image);
}