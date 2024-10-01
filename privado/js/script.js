function calcularTotal() {
    let quantidade = parseInt(document.getElementById('quantidade').value, 10);
    let preco = parseFloat(document.getElementById('preco').textContent.replace(',', '.'));
  
    let valorTotal = quantidade * preco;
    document.getElementById('valorTotal').textContent = `R$ ${valorTotal.toFixed(2)}`.replace('.',',');
}
