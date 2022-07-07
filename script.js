/*
    Aqui definimos os tipos de imagens que serão aceitas
*/
const types = [
    'image/jpg',
    'image/jpeg',
    'image/bmp',
    'image/png'
]

const infoAfter = document.getElementById('infoNew');
const infoBefore = document.getElementById('infoOrigin');

/*
    Aqui definimos as dimensões máximas da nova imagem
*/
const MAX_WIDTH = 640;
const MAX_HEIGHT = 640;

/*
    Aqui definimos o que será feito com a imagem passada como parâmetro
*/
const callback = (image, id) => {
    //Recuperando o endereço temporário da imagem
    const src = URL.createObjectURL(image);
    //Definindo uma variável para setar a imagem e exibir para o usuário
    const preview = document.getElementById(id);
    //Atribuindo o caminho da imagem ao src
    preview.src = src;
    //Exibindo para o usuário o tamanho dos arquivos
    id === "origin" ? infoBefore.innerHTML = `${image.name} - ${(image.size / 1024 / 1024).toFixed(2)} Mb` : infoAfter.innerHTML = `${image.name} - ${(image.size / 1024 / 1024).toFixed(2)} Mb`;
};

/*
    Função chamada após a seleção da imagem
*/
function handleOnChange() {
    //Definimos uma variável com os arquivos selecionados do input
    const files = document.getElementById('files').files;
    //Validamos se foi selecionado ao menos e apenas um arquivo e se o tipo de arquivo não está entre os pré-definidos na nossa configuração
    if (files.lentgh === 0) {
        alert('Não foram selecionadas imagens.');
        return;
    } else if (files.lentgh > 1) {
        alert('Permitido apenas uma compactação por vez.');
        return;
    } else if (!types.includes(files[0].type.toString())) {
        alert('Tipo de arquivo não permitido. Os tipos aceitos são JPG, JPEG, BMP, PNG');
        return;
    }
    callback(files[0], 'origin');
    resize(files[0]);
};

/*
    Função que realiza o redimensionamento da imagem
*/
function resize(image) {
    //Definimos a variável que será a nova imagem
    const img = new Image();
    //Definimos um READER para fazer a leitura da nova imagem
    const reader = new FileReader();
    //Definimos uma função de callback que será chamada quando o canvas converter o arquivo para blob
    const createFileFromBlob = (blob) => {
        //Definimos um FILE(arquivo) com o blob passando o nome, o tipo e a ultima modificação da imagem recebida no parâmetro da função
        const imageResized = new File(
            [blob],
            image.name,
            {
                type: image.type,
                lastModified: Date.now()
            }
        );
        //Nesse ponto finalizamos a conversão da imagem
        callback(imageResized, 'newImage');
    };

    //Sobrescrevemos o método onload do reader, e definimos o que deve ser feito após finalizar a leitura
    reader.onload = (e) => {
        //Trabalhando com a imagem criada no inicio dessa função
        img.src = e.target.result;
        //Sobrescrevemos o método onload da imagem, e definimos o que deve ser feito após finalizar o carregamento
        img.onload = () => {
            //Criamos um canvas
            const canvas = document.createElement('canvas');
            //Lógica para saber qual lado é maior e reduzir na propoção correta
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
            //Definimos as dimensões do canvas de acordo com os calculos acima
            canvas.width = width;
            canvas.height = height;
            //Criamos uma variável com o contexto do canvas
            const ctx = canvas.getContext("2d");
            //Desenhamos no canvas a nova imagem, definindo a posição de inicio(x,y) e as dimensões
            ctx.drawImage(img, 0, 0, width, height);
            /*
                Aqui é onde a magia acontece
                Primeiro convertemos a imagem desenhada pelo canvas para o formato Blob
                O primeiro parametro é a função de callback que ele irá chamar após converter
                O segundo o tipo(extensão) da imagem
                O terceiro é a qualidade variando de 0 a 1
            */
            ctx.canvas.toBlob(createFileFromBlob, image.type, 1);
        };
    };
    //Após a definição do que deve ser feito com a image, lemos a imagem
    reader.readAsDataURL(image);
}
