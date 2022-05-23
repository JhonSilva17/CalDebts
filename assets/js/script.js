// Variáveis das transações
const itemValue = document.querySelector('#item-value')
const itemName = document.querySelector('#item-name')
const itemDate = document.querySelector('#item-date')

const ulOuput = document.querySelector('.list-items')
let transactions = JSON.parse(localStorage.getItem('transactions')) || []
let values = JSON.parse(localStorage.getItem('values')) || []
let data = JSON.parse(localStorage.getItem('date')) || []

const profit = document.querySelector('#ganhos')
const expense = document.querySelector('#despesas')
const total = document.querySelector('#total')

// Função que recebe o ano e o mês e retorno o último dia do mês especificado
function retUltimoDia(year, month){
    var ultimoDia = (new Date(year, month, 0)).getDate();
    return ultimoDia;
}

// Função que formata a data no padrão Brasil
function formatDate(str, separator) {
    const strToArray = str.split(separator)
    switch (strToArray[1]) {
        case '01':
            strToArray[1] = 'Janerio'
            break;
        case '02':
            strToArray[1] = 'Fevereiro'
            break;
        case '03':
            strToArray[1] = 'Março'
            break;
        case '04':
            strToArray[1] = 'Abril'
            break;
        case '05':
            strToArray[1] = 'Maio'
            break;
        case '06':
            strToArray[1] = 'Junho'
            break;
        case '07':
            strToArray[1] = 'Julho'
            break;
        case '08':
            strToArray[1] = 'Agosto'
            break;
        case '09':
            strToArray[1] = 'Setembro'
            break;
        case '10':
            strToArray[1] = 'Outubro'
            break;
        case '11':
            strToArray[1] = 'Novembro'
            break;
        case '12':
            strToArray[1] = 'Dezembro'
            break;
    }
    return `${strToArray[2]} de ${strToArray[1]} de ${strToArray[0]}`
}

function date() {
    const date = new Date()
    const ano = date.getFullYear()
    // se o dia for menor que 10 irei acrescentar o 0 na frente do número
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    // se o mÊs for menor que 10 irei acrescentar o 0 na frente do número e irei somar mais, pois os meses são indexados, portanto começam a partir do número 0
    const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth()
    const maxDate = `${ano}-${month}-${retUltimoDia(ano, month)}`

    // Cria e adiciona valores aos atributos do input date no HTML
    const attrMinDate = itemDate.setAttribute('min', `${ano}-${month}-01`)
    const attrMaxDate = itemDate.setAttribute('max', maxDate)
    const attrValue = itemDate.setAttribute('value', `${ano}-${month}-${day}`)
}
date()

// Função que desenvolve a lista com os nomes e os valores das transações
function atualizaTela() {
    ulOuput.innerHTML = '';

    transactions.forEach((item, index)=> {
        // Criando o item da lista
        let li = document.createElement('li')
        li.classList.add('item')
        ulOuput.appendChild(li)

        // Criando o span da data
        let spanDate = document.createElement('span')
        spanDate.classList.add('date')
        let contentSpanDate = document.createTextNode(`data da transação: ${formatDate(data[index], '-')}`)
        spanDate.appendChild(contentSpanDate)
        li.appendChild(spanDate)

        // Criando a div 
        let div = document.createElement('div')
        div.classList.add('items-data')
        li.appendChild(div)

        // criando a tag do nome da transação
        let spanName = document.createElement('span')
        let textSpanName = document.createTextNode(item)
        spanName.appendChild(textSpanName)
        spanName.classList.add('color-dark')
        div.appendChild(spanName)

        // criando a tag do valor da transação
        let spanValue = document.createElement('span')
        let spanValueText = document.createTextNode(formatCurrency(Number(values[index])))
        spanValue.classList.add(values[index] < 0 ? 'color-red' : 'color-green')
        spanValue.appendChild(spanValueText)
        div.appendChild(spanValue)

        li.addEventListener('click', ()=> {
            const confirmation = confirm('Tem certeza que quer remover sua transação?')
            // Caso o 'confirmation' for true, o código abaixo será executado
            if (confirmation) {
                ulOuput.removeChild(li)
                remove(transactions, item) // Removendo os itens clicados da lista 
                remove(values, values[index]) // Removendo os itens clicados da lista 
                remove(data, data[index])
                saveStorage('Transactions', transactions) // Salvando as remoções no localStorage
            }
            cardsValues()
        })
    })
}
atualizaTela() // Sempre que a página recarrega, a função é ativada

// Função que efetua os cálculos e atualiza as informações nos cards superiores da aplicação
function cardsValues() {
    let somaGanhos = 0
    let somaExpense = 0

    values.forEach(item => {
        if (item > 0) {
            somaGanhos = somaGanhos + item
        } else if (item < 0) {
            somaExpense = somaExpense + item
        }
    })

    let somaTotal = somaGanhos - (somaExpense * -1)

    localStorage.setItem('somaGanhos', formatCurrency(somaGanhos))
    localStorage.setItem('somaExpense', formatCurrency(somaExpense))
    localStorage.setItem('somaTotal', formatCurrency(somaTotal))

    profit.innerHTML = localStorage.getItem('somaGanhos')
    expense.innerHTML = localStorage.getItem('somaExpense')
    total.innerHTML = localStorage.getItem('somaTotal')

}
cardsValues() // Sempre que a página recarrega, a função é ativada

// Função que formata o número em formato da moeda brasileira
function formatCurrency(value){
    return value.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
}

// Função que remove itens de um determinada array
function remove(arr, item) {
    // arr.indexOf(item): retorna a posição do item no array
    // arr.splice(arr.indexOf(item, 1)) - está removendo o item na posição informada(do item) e remove apenas 1 elemento apartir da posição do item
    arr.splice(arr.indexOf(item), 1)

    atualizaTela() // Atualizo a tela com os valores removidos
    saveStorage() // Salvo as remoções no localStorage
}

// Função que salva os arrays de dados no localStorage
function saveStorage() {
    // Definindo uma chave para o array transactions, transformei todo o array em String JSON.(Pois o local storage só armazena o tipo de dado string)
    localStorage.setItem('transactions', JSON.stringify(transactions))
    localStorage.setItem('values', JSON.stringify(values))
    localStorage.setItem('date', JSON.stringify(data))
}

const buttonSend = document.querySelector('#btnSend')
// Callback que executa as funções quando o botão é acionado
buttonSend.addEventListener('click', (event)=> {
    event.preventDefault() // Impedindo que o botão recarregue a página após o clique
    
    // Estou verificando se os campos estão vazios, se estiver eu nao executo o script.
    if (itemValue.value == '' || itemName.value == '') {
        alert('Você deve preencher todos os campos.')
    } else {
        transactions.push(itemName.value) // Adicionando ao array transactions, o valor digitado no input 'itemName'
        values.push(Number(itemValue.value)) // Adicionando ao array values, o valor digitado no input 'itemValue'
        data.push(itemDate.value)
        cardsValues() // Quando o botão é clicado a função é chamado
        atualizaTela() // Quando o botão é clicado a função é chamado
        saveStorage() // Quando o botão é clicado a função é chamado
        
        // Ao atualizar a tela com os dados, os inputs são limpos
        itemName.value = ''
        itemValue.value = ''
        itemDate.value = ''
    }
})