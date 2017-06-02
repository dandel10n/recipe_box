import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class RecipeBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: ['pasta', 'salad']
        }
    }

    render() {
        const{recipes} = this.state;
        return (
            <div className="container">
                <div>Reciepe Box</div>
                {
                    recipes.map(item => {
                        return <p key={item}>{item}</p>
                    })
                }
            </div>
        );
    }
}

ReactDOM.render(
    <RecipeBox />,
    document.getElementById('root')
);
