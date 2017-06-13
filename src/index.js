import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { storageAvaliable } from './utils';


const Recipes = (props) => {
    return (
        <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            { props.recipes.map((recipe, indexOfRecipe) => {
                return (
                    <div className="panel panel-default" key={indexOfRecipe}>
                        <div className="panel-heading"
                             role="tab"
                             id={"recipe-title-" + indexOfRecipe}>
                            <h4 className="panel-title">
                                <a role="button"
                                   data-toggle="collapse"
                                   data-parent="#accordion"
                                   href={ "#recipe-data-" + indexOfRecipe}
                                   aria-expanded="true"
                                   aria-controls={ "#recipe-data-" + indexOfRecipe}>
                                    {recipe.title}
                                </a>
                            </h4>
                        </div>
                        <div id={"recipe-data-" + indexOfRecipe}
                             className="panel-collapse collapse"
                             role="tabpanel"
                             aria-labelledby={"recipe-title-" + indexOfRecipe}>
                            <div className="panel-body">
                                {recipe.ingredients.map((ingredient, indexOfIng) => {
                                    return <li key={indexOfIng}>{ ingredient }</li>
                                })}
                            </div>
                            <button
                                value="Edit"
                                className="btn btn-default btn-sm"
                                onClick={() => props.handleEditButtonClick(recipe)}
                            >Edit</button>
                            <button
                                value="Delete"
                                className="btn btn-default btn-sm"
                                onClick={() => props.deleteRecipe(indexOfRecipe)}
                            >Delete</button>
                        </div>
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

    addRecipe(recipeTitle, recipeIngredients)  {
        const {recipes, recipeToEdit} = this.state;
        const newRecipe = {
            title: recipeTitle,
            ingredients: recipeIngredients,
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

        if (newArrayOfRecipes.length === 0) {
            this.setState({
                message: "No recipes in your box, add some."
            })
        }
    }

    handleEditButtonClick(recipe) {
        this.setState({ recipeToEdit: recipe });
        this.showForm();
    }

    showForm() {
        this.setState({
            formIsShown: true,
            message: ""
        });
    }

    hideForm() {
        this.setState({
            formIsShown: false,
            recipeToEdit: ""
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
        ).filter(item => item != "");

        if (newRecipeTitle !== '' && newRecipeIngredients.length !== 0) {
            this.props.onSubmit(newRecipeTitle, newRecipeIngredients);
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
                        className="form-control"
                        id="newRecipeTitle"
                        ref={input => this.newRecipeTitle = input}
                        type="text"
                        name="formTitle"
                        placeholder={"Recipe name"}
                        defaultValue={this.props.recipe && this.props.recipe.title || ""}
                    />
                    <label htmlFor="newRecipeIngredients">Ingredients</label>
                    <textarea
                        className="form-control"
                        id="newRecipeIngredients"
                        ref={input => this.newRecipeIngredients = input}
                        rows="3"
                        name="formIngredients"
                        placeholder={"Enter ingredients, separated by commas"}
                        defaultValue={this.props.recipe && this.props.recipe.ingredients || ""}
                    />
                    <button
                        type="submit"
                        value="Save"
                        className="btn btn-default btn-sm"
                    >Save</button>
                    <button
                        value="Cancel"
                        className="btn btn-default btn-sm"
                        onClick={this.handleCancel}
                    >Cancel</button>
                </div>
            </form>
        )
    }
}

ReactDOM.render(
    <RecipeBox />,
    document.getElementById('root')
);
