// src/context/CartContext.jsx (atualizado)
import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADICIONAR_PRODUTO":
      const existingItem = state.itens.find(item => item.id === action.payload.produto.id);
      
      if (existingItem) {
        return {
          ...state,
          itens: state.itens.map(item =>
            item.id === action.payload.produto.id
              ? { 
                  ...item, 
                  quantidade: item.quantidade + action.payload.quantidade 
                }
              : item
          )
        };
      }
      
      return {
        ...state,
        itens: [...state.itens, { 
          ...action.payload.produto, 
          quantidade: action.payload.quantidade 
        }]
      };

    case "REMOVER_PRODUTO":
      return {
        ...state,
        itens: state.itens.filter(item => item.id !== action.payload)
      };

    case "ATUALIZAR_QUANTIDADE":
      return {
        ...state,
        itens: state.itens.map(item =>
          item.id === action.payload.produtoId
            ? { ...item, quantidade: action.payload.quantidade }
            : item
        )
      };

    case "LIMPAR_CARRINHO":
      return {
        ...state,
        itens: []
      };

    case "CARREGAR_CARRINHO":
      return {
        ...state,
        itens: action.payload
      };

    default:
      return state;
  }
};

const initialState = {
  itens: []
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Carregar carrinho do localStorage ao inicializar
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem("carrinho");
    if (carrinhoSalvo) {
      dispatch({
        type: "CARREGAR_CARRINHO",
        payload: JSON.parse(carrinhoSalvo)
      });
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(state.itens));
  }, [state.itens]);

  const adicionarProduto = (produto, quantidade = 1) => {
    dispatch({
      type: "ADICIONAR_PRODUTO",
      payload: { produto, quantidade }
    });
  };

  const removerProduto = (produtoId) => {
    dispatch({
      type: "REMOVER_PRODUTO",
      payload: produtoId
    });
  };

  const atualizarQuantidade = (produtoId, quantidade) => {
    dispatch({
      type: "ATUALIZAR_QUANTIDADE",
      payload: { produtoId, quantidade }
    });
  };

  const limparCarrinho = () => {
    dispatch({ type: "LIMPAR_CARRINHO" });
  };

  const getTotalItens = () => {
    return state.itens.reduce((total, item) => total + item.quantidade, 0);
  };

  const getTotalPreco = () => {
    return state.itens.reduce((total, item) => total + (item.price * item.quantidade), 0);
  };

  const value = {
    itens: state.itens,
    adicionarProduto,
    removerProduto,
    atualizarQuantidade,
    limparCarrinho,
    getTotalItens,
    getTotalPreco
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro de um CartProvider");
  }
  return context;
};