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
        }
        this.isStorageAvailible = storageAvaliable('localStorage');
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addRecipe = this.addRecipe.bind(this);
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

    handleSubmit(event) {
        event.preventDefault();
        const newRecipeTitle = this.newRecipeTitle.value;
        const newRecipeIngredients = this.newRecipeIngredients.value.split(',').map(
            item => { return item.trim() }
        );

        this.addRecipe(newRecipeTitle, newRecipeIngredients);

        this.addForm.reset();
    }

    addRecipe(recipeTitle, recipeIngredients)  {
        const {recipes} = this.state;
        const newRecipe = {
            title: recipeTitle,
            ingredients: recipeIngredients,
        }
        this.setState({
            recipes: [...recipes, newRecipe]
        });
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
                <form ref={input => this.addForm = input}
                    onSubmit={ e => this.handleSubmit(e) }
                >
                    <input
                        ref={input => this.newRecipeTitle = input}
                        type="text"
                        name="formTitle"
                        placeholder={"Enter title"}
                    />
                    <textarea
                        ref={input => this.newRecipeIngredients = input}
                        type="text"
                        name="formIngredients"
                        placeholder={"Enter ingredients"}
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
