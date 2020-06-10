import React, {Component} from "react"
import { connect } from "react-redux";
import Spinner from '../../../shared/alerts/Spinner';
import BadAlert from '../../../shared/alerts/BadAlert';
import GoodAlert from '../../../shared/alerts/GoodAlert';
import JustAlert from '../../../shared/alerts/JustAlert';


import "./newfaculte.css"
import NewMatiere from "./NewMatiere";
import ComponentDeroulement from './ComponentDeroulement'


class NewFaculte extends Component
{
	state = {
		/*
			Data needed is as shown here
				1. list of all faculties
		*/
		facultes:[],
		nomFaculte: "",
		filieres:[],
		createdDate:'',
		edit:'',
		filiereEdit:'',
		showTop:false
	}

	addNewFiliere=(filiereObject)=>{
		this.setState({
			filieres:filiereObject
		})
	}

	handleDelete=(e)=>{
        let element = e.target.id
        let newList = this.state.filieres.filter(filiere=>Number(element) !== filiere.index)
        newList = this.adjustIndex(newList)
        this.setState({filieres:newList})
    }

    adjustIndex = (listArray) => {
        let index = 0;
        let tempQuestions = []
        listArray.map(filiere => {
            index = index + 1
            filiere.index = index
            tempQuestions.push(filiere)
            return null;
        })

        return tempQuestions;
	}
	
	handleDeleteFaculty=(facultyIndex)=>{
		console.log(facultyIndex,this.props.facultes[facultyIndex-1])
		this.setState({spin:true, spinMessage:"Nous supprimons la faculte"})
		fetch(`https://tranquil-thicket-81941.herokuapp.com/faculty/${this.props.facultes[facultyIndex-1]._id}/delete`, {
            method: 'delete',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
          })
          .then(response=>response.json())
          .then(data=>{
          	console.log(data.message)
            if(data.message){
				this.props.dispatch({type: "DELETE_FACULTY", payload: facultyIndex})
				this.setState({
					spin:false,
					alertCounter:0,
					spinMessage:`Suppression de la faculte ${facultyIndex} faite avec success`,
					gAlert:'good',
				})	
            }
            else{
			  console.log(data)
			  this.setState({
                spin:false,
                alertCounter:0,
                spinMessage:`Echec de suppression`,
                gAlert:'bad',
                })

            }
          })
          .catch(error=>{
			this.setState({
                spin:false,
                alertCounter:0,
                spinMessage:`INTERNAL SERVER ERROR`,
                gAlert:'just',
			})
			  console.log(error)
			})
		//facultyIndex is the index of the faculty to be deleted.
		//this function is meant for deleting that faculty from the database. so delete this faculty
	}

	handleEditBtn =(e)=>{
		console.log(e+"this is good life")
        let element = this.state.filieres.find(filiere=>filiere.index === Number(e.target.id))
        let icon = document.getElementById('fa-icon')
            icon.classList.remove('fa-minus-circle')
            icon.classList.add('fa-plus-circle')
        this.setState({
            filiereEdit:element,
            edit:e.target.id,
            open:false
        })
	}
	
	handleEditChange=(e)=>{
        let editFiliere = {nomFiliere:e.target.value, niveauMax:this.state.filiereEdit.niveauMax, index:this.state.filiereEdit.index}
        this.setState({filiereEdit:editFiliere})
    }

	handleEditSave =()=>{
        let newFilieres = []
        this.state.filieres.filter(filiere=>{
            if(filiere.index === this.state.filiereEdit.index) newFilieres.push(this.state.filiereEdit)
            else newFilieres.push(filiere)
            return null
        })
        this.setState({filieres:newFilieres, edit:''})

	}
	
	loadClasses=async ()=>{
		let classes = await fetch('https://tranquil-thicket-81941.herokuapp.com/classe/', {
			method: 'get',
			headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
			})
		.then(response=>response.json())
		
		console.log(classes)
		if(!classes.message) throw Error("Couldn't retrieve classes"); 
		classes.message = classes.message.map(classe=> {
			return {
				idClasse:classe._id, 
				filiere:{
					nomFiliere:classe.nomClasse, 
					idFiliere: classe.idFiliere
				}, 
				niveau:classe.niveau
			}
		})
		
		this.props.dispatch({type: "LOAD_CLASSE", payload: classes.message})
	}
	
	handleCreateClick=()=>{
		if(this.state.nomFaculte !== '' && this.state.filieres.length!==0)
		{
			document.getElementById('nomFaculte').value=""
			//this is the data to be uploaded
			// uploadData is the faculty to be created... verify that the data in it coincides with the data to be uploaded then upload. without which please try to complete it as it should be.
			let newFilieres = this.state.filieres.map(filiere=>{ return{nomFiliere: filiere.nomFiliere, maxNiveau: filiere.niveauMax, startDate: Date.now()}})
			this.setState({spin:true, spinMessage:"Nous creeons la faculte"})
			fetch('https://tranquil-thicket-81941.herokuapp.com/faculty/new', {
            method: 'post',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
            body: JSON.stringify({
              nomFaculty: this.state.nomFaculte,
              filieres: newFilieres,
              startDate:Date.now(),

            })
          })
          .then(response=>response.json())
          .then(data=>{
            if(data.message){
				let uploadData={nomFaculte:this.state.nomFaculte, filieres:this.state.filieres, index:this.props.facultes.length+1, _id: data.message}
              	this.setState({
					showTop:true,
					filieres:[],
					nomFaculte:''
					}, async ()=>{
						await this.props.dispatch({type:"CREATE_FACULTY", payload: [uploadData]})
						this.setState({
                            spin:false,
                            alertCounter:0,
                            spinMessage:"Faculte cree avec success",
                            gAlert:'good',
                        })
						// this.loadClasses()						
						console.log(this.props.facultes)
				})
            }
            else{
				console.log(data)
				this.setState({
					spin:false,
					alertCounter:0,
					spinMessage:"Echec de creation de faculte",
					gAlert:'bad',
				})
            }
          })
          .catch(error=>{
			  console.log(error)
			  this.setState({
				spin:false,
				alertCounter:0,
				spinMessage:"INTERNAL SERVER ERROR",
				gAlert:'just',
			})
		})
		}else{
			alert('Nom de faculté vide ou pas de filières')
		}
	}







	handleChange = (event) =>{
		this.setState({nomFaculte: event.currentTarget.value});
	}

	displayAndHiddenContent = (e) =>{
		let firstChild = e.currentTarget.firstElementChild.firstElementChild;

	    if(firstChild.classList.contains("fa-plus-circle"))
	    {
	    	/* Afficher le contenu*/
	        firstChild.classList.remove('fa-plus-circle');
			firstChild.classList.add('fa-minus-circle');
			this.setState({open:true})
	    }
	    else
	    {
	    	/* Cacher le contenu*/
	        firstChild.classList.remove('fa-minus-circle');
	        firstChild.classList.add('fa-plus-circle');
	        /* Vider l'ensemble des champs */
	        //Le nomFaculte de la faculte
	        this.setState({nomFaculte:''});

	        //L'ensemble des filiere de la faculte
			//Supprimer la liste ici
			
			this.setState({open:false})
	    }
	}

	componentDidMount(){
		fetch('https://tranquil-thicket-81941.herokuapp.com/faculty/', {
            method: 'get',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
          })
          .then(response=>response.json())
          .then(async data=>{
            if(data.message){
	            let classes = await fetch('https://tranquil-thicket-81941.herokuapp.com/classe/', {
		            method: 'get',
		            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
	         		 })
		          .then(response=>response.json())
		          
		          if(!classes.message) throw Error("Couldn't retrieve classes");
		          console.log(classes.message)
		          classes.message = classes.message.map(classe=> {
		          	return {
		          		idClasse:classe._id, 
		          		filiere:{
		          			nomFiliere:classe.nomClasse, 
		          			idFiliere: classe.idFiliere
		          		}, 
		          		niveau:classe.niveau
		          	}
		          })
		          await this.props.dispatch({type: "LOAD_CLASSE", payload: classes.message})

            	let Facultx = data.message.map((faculty,j)=>{
            		return{
            	    nomFaculte: faculty.nomFaculty,
            	    filieres: faculty.filieres.map((filiere,i)=>{
            	    	return {
	            	     nomFiliere: filiere.nomFiliere, 
	            	     niveauMax: filiere.maxNiveau, 
	            	     index: i+1,
	            	     _id: filiere._id
            	    	}
            	    }), 
            	    index: j+1,
            	    _id: faculty._id
            	  }
            	})
             this.props.dispatch({type: "CREATE_FACULTY", payload: Facultx})
            }
            else{
              console.log(data)
            }
          })
          .catch(error=>console.log(error.message))		
	}

	setGAlertFalse=()=>{
        this.setState({gAlert:false})
    }
  
    setAlertCounter=()=>{
        this.setState({alertCounter:this.state.alertCounter+1})
    }

	render()
	{
		return(
			<section className = "container">
				<span className='blockTitle'>ADMINISTRATION DES FACULTES</span>
				<Spinner spin={this.state.spin} message={this.state.spinMessage}/>
                {this.state.gAlert?<BadAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                {this.state.gAlert?<GoodAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                {this.state.gAlert?<JustAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}

				<div>
					{this.props.facultes.length!==0?<ComponentDeroulement facultes={this.props.facultes} handleDeleteFaculty={this.handleDeleteFaculty} />:null}
					<div className = "header" onClick = {this.displayAndHiddenContent}>
						<span className = "icon"><i className ="fa fa-plus-circle fa-2x"></i></span>
						<span className = "title"> Nouvelle faculte </span>
					</div>
				</div>
				{
					(this.state.open)?<div className = "newFaculteMain">
						<div>
							<header className = "main-header">
								<input type = "text" className = "input-field" id='nomFaculte' placeholder = "Nom de la faculte" value = {this.state.nomFaculte} onChange = {this.handleChange} />
							</header>
							
							
							<main className = "main-main">
								<section className = "filiere">
									<NewMatiere filieres={this.state.filieres} 
										edit={this.state.edit}
										handleEditChange={this.handleEditChange}
										handleEditSave={this.handleEditSave}
										handleDelete={this.handleDelete}
										filiereEdit={this.state.filiereEdit}
										handleEditBtn={this.handleEditBtn}
										addNewFiliere={this.addNewFiliere}
									/>
								</section>
							</main>
						</div>

						<footer className = "main-footer">
							<input type = "submit" value = "Create" onClick={this.handleCreateClick} className = "main-button" />
						</footer>
					</div>:null
				}
			</section>
		)
		
	}
}


const mapStateToProps = (state) => {
    return {
        facultes: state.Faculty.faculties,
    }
};

export default  connect(mapStateToProps)(NewFaculte)