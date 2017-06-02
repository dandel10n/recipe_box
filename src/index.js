import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { storageAvaliable } from './utils';


const Recipes = (props) => {
    return (
        <div>
            { props.recipes.map(recipe => {
                return (
                    <div key={recipe.id}>
                        <p>{recipe.title}</p>
                        <p>{recipe.ingredients.map((ingridient, index) => {
                                return <li key={index}>{ ingridient }</li>
                            })}
                        </p>
                    </div>
                    )
                })
            }
        </div>
    )
}

class RecipeBox extends React.Component {
    localStorageKey = "dandel10n_recipes";
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
    }

    componentWillMount() {
        if (this.isStorageAvailible) {
            const savedData = localStorage.getItem(this.localStorageKey);
            if (savedData) {
                this.setState({ recipes: JSON.parse(savedData) });
            }
        }
    }

    componentDidUpdate() {
        this.updateLocalStorage();
    }

    updateLocalStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.state.recipes));
    }

    render() {
        if (!this.isStorageAvailible) {
            return (
                <div>
                    Your recipes will not be saved becouse
                    of technical problems :(
                </div>
            )
        } return (
            <div className="container">
                <div>Reciepe Box</div>
                <Recipes recipes={this.state.recipes}/>
            </div>
        );
    }
}

ReactDOM.render(
    <RecipeBox />,
    document.getElementById('root')
);
