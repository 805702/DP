import React, { Component } from 'react'
import './NewMatiere.css'

export default class NewMatiere extends Component {
    state={
        matieres:[],
        matiere:'',
        code:'',
        poid:'',
        matiereEdit:{nomMatiere:'', code:'', poid:'', index:0},
        open:false,
        edit:''
    }

    
    styleFiliere =()=>{
        return this.state.matieres.map(matiere=>{
            return Number(this.state.edit) === matiere.index?
            (
            <div className="StyledFiliere" key={matiere.index}>
                <h2>{matiere.index}</h2>
                <input type='text' value={this.state.matiereEdit.nomFiliere} onChange={this.handleEditChange} className='editInput' id='EditInput' />
                <h2>{matiere.code}</h2>
                <input type='submit' value='Save' onClick={this.handleEditSave} className='newFilierSubmit1'/>
                <input type='submit' value='Delete' onClick={this.handleDelete} id={matiere.index} className='newFilierSubmit'/>
            </div>
            ):(
            <div className="StyledFiliere" key={matiere.index}>
                <h2>{matiere.index}</h2>
                <h2>{matiere.nomMatiere}</h2>
                <h2>{matiere.code}</h2>
                <input type='submit' value='Editer' onClick={this.handleEditBtn} id={matiere.index} className='newFilierSubmit1'/>
                <input type='submit' value='Delete' onClick={this.handleDelete} id={matiere.index} className='newFilierSubmit'/>
            </div>
            )
                
        })
    }

    handleEditSave =()=>{
        //push filiereEdit into filieres at the right position
        let newMatieres = []
        this.state.matieres.filter(matiere=>{
            if(matiere.index === this.state.matiereEdit.index) newMatieres.push(this.state.matiereEdit)
            else newMatieres.push(matiere)
            return null
        })
        this.setState({matieres:newMatieres,edit:''})
        //put edit back to empty


    }
    
    handleEditChange=(e)=>{
        let newElement = {nomMatiere:e.target.value, code:this.state.matiereEdit.code, index:this.state.matiereEdit.index}
        this.setState({matiereEdit:newElement})
    }

    handleDelete=(e)=>{
        let element = e.target.id
        let newList = this.state.matieres.filter(matiere=>{return Number(element) !== matiere.index})
        newList = this.adjustIndex(newList)
        this.setState({matieres:newList})
    }

    adjustIndex = (listArray) => {
        let index = 0;
        let tempQuestions = []
        listArray.map(matiere => {
            index = index + 1
            matiere.index = index
            tempQuestions.push(matiere)
            return null;
        })

        return tempQuestions;
    }

    handleEditBtn =(e)=>{
        let element = this.state.matieres.find(matiere=>matiere.index === Number(e.target.id))
        let icon = document.getElementById('fa-icon')
            icon.classList.remove('fa-minus-circle')
            icon.classList.add('fa-plus-circle')
        this.setState({
            matiereEdit:element,
            edit:e.target.id,
            open:false
        })
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        let submitObject ={nomMatiere:this.state.matiere, code:this.state.code, poid:this.state.poid, index:this.state.matieres.length+1}
        submitObject = [...this.state.matieres, submitObject]
        this.setState({matieres:submitObject})
    }

    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value})
    }
    
    toggleFaIcon = ()=>{
        let icon = document.getElementById('fa-icon')
        this.setState({open:!this.state.open})
        if(icon.classList.contains('fa-plus-circle')){
            icon.classList.remove('fa-plus-circle')
            icon.classList.add('fa-minus-circle')
        }else{
            icon.classList.remove('fa-minus-circle')
            icon.classList.add('fa-plus-circle')
        }
    }

    render() {
        return (
            <div>
                {this.styleFiliere()}
                <div className='newFilierep' onClick={this.toggleFaIcon} ><i className='fa fa-plus-circle' id='fa-icon'/>Nouvelle Matiere</div>
                {
                    this.state.open?(
                    <form onSubmit={this.handleSubmit}>
                        <input type='text' onChange={this.handleChange} id='matiere'placeholder='Nom de Matiere' className='newFiliere' />
                        <input type='text' onChange={this.handleChange} id='code' placeholder='Code Matiere' className='filiereNiveauMax' />
                        <input type='text' onChange={this.handleChange} id='poid' placeholder='Poids' className='filiereNiveauMax' />
                        <input type='submit' value='Ajouter' onClick={this.handleSubmit} classNa me='newFiliereSubmit' />
                    </form>):(null)
                }
            </div>
        )
    }
}
