import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store/store'
import {
    SubscriptionConsumer,
    SubscriptionProvider,
} from './contexts/subscriptionContext'

ReactDOM.render(
    <SubscriptionProvider>
        <SubscriptionConsumer>
            {(sub) =>
                sub.state.isInitialized && (
                    <Provider store={store}>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </Provider>
                )
            }
        </SubscriptionConsumer>
    </SubscriptionProvider>,

    document.getElementById('root')
)
