import {gql} from 'apollo-boost'
import {addItemToCart,countCartItems} from './cart.utils'

export const typeDefs = gql`
  extend type Item{
    quantity: Int
  }

  extend type Mutation{
    ToggleCartHidden: Boolean!
    AddItemToCart(item:Item!): [Item]!
  }
`

const GET_CART_HIDDEN = gql`
  {
    cartHidden @client
  }
`

const GET_CART_COUNT = gql`
  {
    itemCount @client
  }
`

const GET_CART_ITEM = gql`
  {
    cartItems @client
  }
`

export const resolvers = {
  Mutation : {
    toggleCartHidden : (_root,_args,{cache},_info) => {
      const {cartHidden} = cache.readQuery({
        query: GET_CART_HIDDEN,
      })

      cache.writeQuery({
        query:GET_CART_HIDDEN,
        cartHidden: {cartHidden:!cartHidden}
      })

      return !cartHidden
    },
    addItemToCart : (_root,{item},{cache},_info) => {
      const {cartItems} = cache.readQuery({
        query: GET_CART_ITEM
      })

      const newCartItems = addItemToCart(cartItems,item)

      cache.writeQuery({
        query: GET_CART_COUNT,
        data: {itemCount: countCartItems(newCartItems)}
      })

      cache.writeQuery({
        query:GET_CART_ITEM,
        data: {cartItems: newCartItems}
      })

      return newCartItems
    }
  }
}