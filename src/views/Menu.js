import '../css/Menu.css'
import bag from'../assets/bag.png'

import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Modal from "react-modal"
import { useSelector, useDispatch } from 'react-redux'

import Header from '../components/Header'
import Footer from '../components/Footer'
import MenuItem from '../components/MenuItem'
import AddOrder from '../components/AddOrder'
import actions from '../actions/orderAction'

// calling function
function Menu() {
//userId,menu,orders storing at state
  const menu = useSelector((state) => { return state.menu })
  const orders = useSelector((state) => { return state.orders })
   const userId = useSelector((state) => { return state.userId })

  const dispatch = useDispatch()

  useEffect(() => {
    async function getMenu() {
      const response = await fetch('http://localhost:8000/api/coffee')
      const data = await response.json()
      console.log('getMenu:', data)
      dispatch(actions.getMenu(data.menu))
    }

    getMenu()
  }, [dispatch])

  const [isOpen, setIsOpen] = useState(false)
  const history = useHistory()

  //toggleModal function
  function toggleModal() {
    setIsOpen(!isOpen)
  }
 //fetching api
  function handlePay() {

    fetch('http://localhost:8000/api/order', {
      body: JSON.stringify({ userId:userId,orders }),
      headers: {
          'Content-Type': 'application/json'
       },
      method: 'POST'
    })
      .then((response) => response.json())
      .then(result => {
  

      const status = {
        orderID: result.id,
        eta: result.eta
      }

      dispatch(actions.postOrder(status))
      
      history.push("/orderstatus")
   })
      .catch(error => {
      console.error('Error:', error)
   })
    
  }

  return (
    <div id="menu">
      <Header />
    <div>
      <div id="circle">
      <img id="bag" src={ bag } alt="Varukorg" role= "button" onClick={toggleModal}/>

      <Modal
        appElement={document.getElementById('menu')}
        isOpen={isOpen}
        onRequestClose={toggleModal}
        className="mymodal"
        overlayClassName="myoverlay"
      >
        <h2 id="title-overlay">Din best??llning</h2>

        <ul className="order-list">
            { orders && orders.map((menu1) => {
                return <AddOrder task={ menu1 } key={`index-${ menu1.id }`} /> 
                
            }) }
            </ul>
            
   <p id="total">Total..............</p> 
        <p id="moms">Inkl moms + dr??narleverans</p>
        
            <button id="pay" onClick={handlePay}>Take my money!</button>
      </Modal>

      <div id="small-circle">
        <p id="number">0</p>
      </div>
      </div>
     
      <h2 id="title-menu">Menu</h2>
       
        <ul className="menu-list">
            { menu.map((menu1) => {
                return <MenuItem task={ menu1 } key={ menu1.id } /> 
            }) }
        </ul>

    </div>
<Footer></Footer>
    
    </div>
  )
}


export default Menu