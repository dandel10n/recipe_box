import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { storageAvaliable } from './utils';

class RecipeBox extends React.Component {
    localStorageKey = "dandel10n_recipes";
    constructor(props) {
        super(props);
        this.state = {
            recipes: [
                {
                    title: "Spaghetti alla carbonara",
                    ingredients: ["spaghetti", "pancetta", "olive oil", "pecorino cheese", "garlic", "eggs", "parsley leaves", "black pepper and salt"],
                    method: "Bring 4.5 litres water to the boil in a large saucepan with eight teaspoons salt. Add the spaghetti and cook until al dente. Meanwhile, cut the pancetta into short little strips. Heat a large, deep frying pan over a medium-high heat, add the oil and the pancetta and fry until lightly golden. Add the garlic and parsley and cook for a few seconds, then remove from the heat and set aside. Drain the spaghetti well, tip into the frying pan with the pancetta, garlic and parsley, add the beaten eggs and half the grated pecorino cheese and toss together well. The heat from the spaghetti will be sufficient to partly cook the egg, but still leave it moist and creamy. Take to the table and serve in warmed pasta bowls, sprinkled with the rest of the cheese."
                },
                {
                    title: "Tuna bean salad",
                    ingredients: ["mixed beans", "boiled eggs", "cherry tomatoes", "spring onions", "tuna steak", "olive oil", "wine vinegar", "mustard", "black pepper"],
                    method: "For the dressing, whisk the oil, vinegar and mustard in a large bowl until thick. Season with black pepper. Add mixed beans, cherry tomatoes and spring onions to the dressing and mix. Flake the tuna on top and add the hard-boiled eggs."
                }
            ],
            formIsShown: false,
            recipeToEdit: null,
            message: ""
        }
        this.isStorageAvailible = storageAvaliable('localStorage');
        this.addRecipe = this.addRecipe.bind(this);
        this.deleteRecipe = this.deleteRecipe.bind(this);
        this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);
        this.showMessage = this.showMessage.bind(this);
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

    addRecipe(recipeTitle, recipeIngredients, recipeMethod)  {
        const {recipes, recipeToEdit} = this.state;
        const newRecipe = {
            title: recipeTitle,
            ingredients: recipeIngredients,
            method: recipeMethod
        }
        const editedRecipesArray = recipes;

        if ( editedRecipesArray.indexOf(recipeToEdit) !== -1 ) {
            editedRecipesArray.splice(editedRecipesArray.indexOf(recipeToEdit), 1, newRecipe);
            this.setState({
                recipes: editedRecipesArray
            });
        } else {
            this.setState({
                recipes: [...recipes, newRecipe],
                message: ""
            });
        }
    }

    deleteRecipe(index) {
        const newArrayOfRecipes = this.state.recipes;
        newArrayOfRecipes.splice(index, 1);
        this.setState({ recipes: newArrayOfRecipes });
    }

    handleEditButtonClick(recipe) {
        this.setState({ recipeToEdit: recipe });
        this.showForm();
    }

    showForm() {
        this.setState({
            formIsShown: true,
            message: ''
        });
    }

    hideForm() {
        this.setState({
            formIsShown: false,
            recipeToEdit: null,
            message: ''
         });
    }

    showMessage(errorExplanation) {
        this.setState({
            message: errorExplanation
        })
    }

    render() {
        if (!this.isStorageAvailible) {
            return (
                <div>
                    Your recipes will not be saved because
                    of technical problems :(
                </div>
            )
        }

        return (
            <div className="container">
                <h1 className="text-center">Recipe Box</h1>
                <div className="content">
                    {
                        this.state.message !== "" &&
                        <p className="message text-danger">{this.state.message}</p>
                    }

                    {
                        this.state.recipes.length === 0 && !this.state.formIsShown &&
                        <p className="message text-danger">No recipes in your box, add some.</p>
                    }

                    {
                        this.state.formIsShown &&
                        <Form
                            onCancel={this.hideForm}
                            onSubmit={this.addRecipe}
                            recipe={this.state.recipeToEdit}
                            onError={this.showMessage}
                        />
                    }

                    {
                        !this.state.formIsShown &&
                        <div>
                            <Recipes
                                recipes={this.state.recipes}
                                deleteRecipe={this.deleteRecipe}
                                handleEditButtonClick={this.handleEditButtonClick}
                            />
                            <button
                                id="addRecipeButton"
                                value="addRecipe"
                                className="btn btn-default"
                                onClick={this.showForm}
                            >Add recipe</button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

const Recipes = (props) => {
    return (
        <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            { props.recipes.map((recipe, indexOfRecipe) => {
                return (
                    <div className="panel panel-default recipePanel" key={indexOfRecipe}>
                        <div className="panel-heading recipePanel-header"
                             role="tab"
                             id={"recipe-title-" + indexOfRecipe}>
                            <h2 className="panel-title recipePanel-title">
                                <a role="button"
                                   data-toggle="collapse"
                                   data-parent="#accordion"
                                   href={ "#recipe-data-" + indexOfRecipe}
                                   aria-expanded="true"
                                   aria-controls={ "#recipe-data-" + indexOfRecipe}>
                                    {recipe.title}
                                </a>
                            </h2>
                        </div>
                        <div id={"recipe-data-" + indexOfRecipe}
                             className="panel-collapse collapse"
                             role="tabpanel"
                             aria-labelledby={"recipe-title-" + indexOfRecipe}>
                            <div className="panel-body recipePanel-body">
                                {recipe.ingredients.map((ingredient, indexOfIng) => {
                                    return <li key={indexOfIng}>{ ingredient }</li>
                                })}
                            </div>
                            <div className="panel-body recipePanel-body">
                                {recipe.method}
                            </div>
                            <button
                                value="Edit"
                                className="btn btn-default btn-sm"
                                onClick={() => props.handleEditButtonClick(recipe)}
                            ><span className="glyphicon glyphicon-pencil panelButton" aria-hidden="true"></span></button>
                            <button
                                value="Delete"
                                className="btn btn-default btn-sm"
                                onClick={() => props.deleteRecipe(indexOfRecipe)}
                            ><span className="glyphicon glyphicon-trash panelButton" aria-hidden="true"></span></button>
                        </div>
                    </div>
                    )
                })
            }
        </div>
    )
}

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEmptyValueError = this.handleEmptyValueError.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const newRecipeTitle = this.newRecipeTitle.value;
        const newRecipeIngredients = this.newRecipeIngredients.value.split(',').map(
            item => { return item.trim() }
        ).filter(item => item !== "");
        const newRecipeMethod = this.newRecipeMethod.value;

        if (newRecipeTitle !== '' && newRecipeIngredients.length !== 0) {
            this.props.onSubmit(newRecipeTitle, newRecipeIngredients, newRecipeMethod);
            this.handleCancel();
        }

        if (newRecipeTitle === '') {
            this.handleEmptyValueError('The resipe should have a title. Add some.')
        }

        if (newRecipeIngredients.length === 0) {
            this.handleEmptyValueError('The resipe should have ingredients. Add some.')
        }

        if (newRecipeTitle === '' && newRecipeIngredients.length === 0) {
            this.handleEmptyValueError('Form fields should be filled in.')
        }
    }

    handleCancel() {
        this.props.onCancel();
    }

    handleEmptyValueError(errorExplanation) {
        this.props.onError(errorExplanation);
    }

    render() {
        return (
            <form
                ref={input => this.addForm = input}
                onSubmit={ e => this.handleSubmit(e) }
            >
                <div className="form-group">
                    <label htmlFor="newRecipeTitle">Recipe</label>
                    <input
                        className="form-control recipeForm"
                        id="newRecipeTitle"
                        ref={input => this.newRecipeTitle = input}
                        type="text"
                        name="formTitle"
                        placeholder={"Recipe name"}
                        defaultValue={this.props.recipe && this.props.recipe.title || ""}
                    />
                    <label htmlFor="newRecipeIngredients">Ingredients</label>
                    <textarea
                        className="form-control recipeForm"
                        id="newRecipeIngredients"
                        ref={input => this.newRecipeIngredients = input}
                        rows="3"
                        name="formIngredients"
                        placeholder={"Enter ingredients, separated by commas"}
                        defaultValue={this.props.recipe && this.props.recipe.ingredients || ""}
                    />
                    <label htmlFor="newRecipeMethod">Method</label>
                    <textarea
                        className="form-control recipeForm"
                        id="newRecipeMethod"
                        ref={input => this.newRecipeMethod = input}
                        rows="5"
                        name="formMethod"
                        placeholder={"Enter method"}
                        defaultValue={this.props.recipe && this.props.recipe.method || ""}
                    />
                    <button
                        type="submit"
                        value="Save"
                        className="btn btn-default btn-sm"
                    ><span className="glyphicon glyphicon-ok panelButton" aria-hidden="true"></span></button>
                    <button
                        value="Cancel"
                        className="btn btn-default btn-sm"
                        onClick={this.handleCancel}
                    ><span className="glyphicon glyphicon-remove panelButton" aria-hidden="true"></span></button>
                </div>
            </form>
        )
    }
}

ReactDOM.render(
    <RecipeBox />,
    document.getElementById('root')
);
