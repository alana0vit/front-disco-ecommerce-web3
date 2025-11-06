// src/services/carrinhoService.js
class CarrinhoService {
  constructor() {
    this.carrinho = this.getCarrinhoFromStorage();
  }

  getCarrinhoFromStorage() {
    const carrinho = localStorage.getItem('carrinho');
    return carrinho ? JSON.parse(carrinho) : [];
  }

  saveCarrinhoToStorage() {
    localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
  }

  adicionarItem(produto, quantidade = 1) {
    const itemExistente = this.carrinho.find(item => item.produto.idProduto === produto.idProduto);
    
    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      this.carrinho.push({
        produto: {
          idProduto: produto.idProduto,
          nome: produto.nome,
          preco: produto.preco,
          imagem: produto.imagem,
          estoque: produto.estoque
        },
        quantidade: quantidade,
        valorUnitario: produto.preco
      });
    }
    
    this.saveCarrinhoToStorage();
    return this.carrinho;
  }

  removerItem(idProduto) {
    this.carrinho = this.carrinho.filter(item => item.produto.idProduto !== idProduto);
    this.saveCarrinhoToStorage();
    return this.carrinho;
  }

  atualizarQuantidade(idProduto, quantidade) {
    const item = this.carrinho.find(item => item.produto.idProduto === idProduto);
    if (item) {
      item.quantidade = quantidade;
      this.saveCarrinhoToStorage();
    }
    return this.carrinho;
  }

  limparCarrinho() {
    this.carrinho = [];
    this.saveCarrinhoToStorage();
  }

  getTotal() {
    return this.carrinho.reduce((total, item) => {
      return total + (item.valorUnitario * item.quantidade);
    }, 0);
  }

  getQuantidadeTotal() {
    return this.carrinho.reduce((total, item) => total + item.quantidade, 0);
  }
}

export default new CarrinhoService();