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
                        <Button
                            onPress={props.editRecipe}
                            buttonName="Edit"
                        />
                        <Button
                            onPress={() => props.deleteRecipe(indexOfRecipe)}
                            buttonName="Delete"
                        />
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
            formIsShown: false
        }
        this.isStorageAvailible = storageAvaliable('localStorage');
        this.addRecipe = this.addRecipe.bind(this);
        this.deleteRecipe = this.deleteRecipe.bind(this);
        this.editRecipe = this.editRecipe.bind(this);
        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);
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

    deleteRecipe(index) {
        const newArrayOfRecipes = this.state.recipes;
        newArrayOfRecipes.splice(index, 1);
        this.setState({ recipes: newArrayOfRecipes });
    }

    editRecipe() {
        console.log("edit");
    }

    showForm() {
        this.setState({ formIsShown: true });
    }

    hideForm() {
        this.setState({ formIsShown: false });
    }

    render() {
        if (!this.isStorageAvailible) {
            return (
                <div>
                    Your recipes will not be saved because
                    of technical problems :(
                </div>
            )
        } else {
            if (!this.state.formIsShown) {
                return (
                    <div className="container">
                        <div>Reciepe Box</div>
                        <Recipes
                            recipes={this.state.recipes}
                            deleteRecipe={this.deleteRecipe}
                            editRecipe={this.editRecipe}
                        />
                        <Button
                            onPress={this.showForm}
                            buttonName="Add recipe"
                        />
                    </div>
                )
            } return (
                <div className="container">
                    <div>Reciepe Box</div>
                    <Form
                        onCancel={this.hideForm}
                        onSubmit={this.addRecipe}
                    />
                </div>
            );
        }
    }
}

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const newRecipeTitle = this.newRecipeTitle.value;
        const newRecipeIngredients = this.newRecipeIngredients.value.split(',').map(
            item => { return item.trim() }
        );

        this.props.onSubmit(newRecipeTitle, newRecipeIngredients);

        this.handleCancel();
    }

    handleCancel() {
        this.props.onCancel();
    }

    render() {
        return (
            <form
                ref={input => this.addForm = input}
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
                <Button onPress={this.handleCancel} buttonName="Cancel"/>
            </form>
        )
    }
}

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.handlePress = this.handlePress.bind(this);
    }

    render() {
        return (
            <button href="#" onClick={this.handlePress}>{this.props.buttonName}</button>
        )
    }

    handlePress(e) {
        e.preventDefault();
        this.props.onPress();
    }
}

ReactDOM.render(
    <RecipeBox />,
    document.getElementById('root')
);
