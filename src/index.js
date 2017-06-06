import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { storageAvaliable } from './utils';


const Recipes = (props) => {
    return (
        <div>
            { props.recipes.map((recipe, indexOfRecipe) => {
                return (
                    <div key={indexOfRecipe}>
                        <p>{recipe.title}</p>
                        <p>{recipe.ingredients.map((ingredient, indexOfIng) => {
                                return <li key={indexOfIng}>{ ingredient }</li>
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
                    title: "Test1",
                    ingredients: ["ing1", "ing2", "ing3"],
                },
                {
                    title: "Test2",
                    ingredients: ["ing1", "ing2", "ing3"],
                }
            ],
            formTitle: '',
            formIngredients: []
        }
        this.isStorageAvailible = storageAvaliable('localStorage');
        this.addRecipe = this.addRecipe.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextareaChange = this.handleTextareaChange.bind(this);
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
        localStorage[this.localStorageKey] = JSON.stringify(this.state.recipes);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({[name]: value});
    }

    handleTextareaChange(event) {
        const target = event.target;
        const ingredientsArray = target.value.split(',');
        /*TODO delete spaces before and after ingredients*/
        const name = target.name;

        this.setState({[name]: ingredientsArray});
    }

    handleSubmit(event) {
        event.preventDefault();
        const formTitle = this.state.formTitle;
        const formIngredients = this.state.formIngredients;
        this.addRecipe(formTitle, formIngredients);
    }

    addRecipe(recipeTitle, recipeIngredients)  {
        const recipes = this.state.recipes;
        const recipe = {
            title: recipeTitle,
            ingredients: recipeIngredients,
        }
        const updatedRecipes = recipes.concat([recipe]);
        this.setState({ recipes: updatedRecipes });
    }

    render() {
        if (!this.isStorageAvailible) {
            return (
                <div>
                    Your recipes will not be saved because
                    of technical problems :(
                </div>
            )
        } return (
            <div className="container">
                <div>Reciepe Box</div>
                <Recipes recipes={this.state.recipes}/>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="formTitle"
                        placeholder={"Enter title"}
                        onChange= {this.handleInputChange}
                    />
                    <textarea
                        type="text"
                        name="formIngredients"
                        placeholder={"Enter ingredients"}
                        onChange= {this.handleTextareaChange}
                    />
                    <input type="submit" value="Save" />
                </form>
            </div>
        );
    }
}

ReactDOM.render(
    <RecipeBox />,
    document.getElementById('root')
);
