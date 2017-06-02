import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function storageAvaliable(type) {
    try {
        var storage = window[type],
        x = '__storage_test__';
        storage.setItem(x,x);
        storage.removeItem(x);
        return true;
    } catch(e) {
        return false;
    }
}

class RecipeBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: [
                {
                    id: 1,
                    title: "Test1",
                    ingredients: ["ing1", "ing2", "ing3"],
                }, {
                    id: 2,
                    title: "Test2",
                    ingredients: ["ing1", "ing2", "ing3"],
                }
            ]
        }
        this.isStorageAvailible = storageAvaliable('localStorage');
        this.handleChange = this.handleChange.bind(this);
    }

    updateLocalStorage() {
        localStorage.setItem('recipeBox', JSON.stringify(this.state.recipes));
    }

    componentWillMount() {
        if (this.isStorageAvailible) {
            const savedData = localStorage.getItem('dandel10n_recipes');
            if (savedData) {
                this.setState({ recipes: JSON.parse(savedData) });
            }
        }
    }

    handleChange(event) {
        this.setState({recipes: event.target.value});
    }

    render() {
        if (!this.isStorageAvailible) {
            return (
                <div>
                    Your recipes will not be saved becouse
                    of technical problems :(
                </div>
            )
        }

        const{recipes} = this.state;
        return (
            <div className="container">
                <div>Reciepe Box</div>
                {
                    recipes.map(item => {
                        return (
                            <div key={item.id}>
                                <p>{item.title}</p>
                                <p>{item.ingredients}</p>
                            </div>
                        )
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
