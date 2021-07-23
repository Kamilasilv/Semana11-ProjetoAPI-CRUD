const travels = require("../models/travels.json");
const utils = require("../utils/travelsUtils");

const fs = require("fs");

const getAllTravels = (req, res) => {
    res.status(200).send(travels)
};

const getAllTravelsOrder = (req, res) => {
    let filteredTravel = travels.filter(quant => quant.busInfos.capacity >0);
    let capacityTravel =  filteredTravel.sort((a, b )=> {

        return (a.busInfos.capacity > b.busInfos.capacity) ? 1 : ((b.busInfos.capacity > a.busInfos.capacity) ? -1 : 0 )
    })
    res.status(200).send(capacityTravel)
}

const getTravelById = (req, res) => {
    let idRequerido = req.params.id;
    let filteredTravel = utils.findById (travels, idRequerido);

    res.status(200).send(filteredTravel)
}

const createPassenger = (req, res) => {
    
    let {name, email, documentNumber} = req.body;

    let idRequerido = req.params.id;

    let newPeople = {
     id: Math.random().toString(32).substr(2), 
     name,
     email,
     documentNumber,
     travelId: filteredTravel.travelId
    }
    let filteredTravel = utils.findById(travels, idRequerido)
    //let filteredTravel = travels.find( t => t.id == idRequerido)

    travels.forEach((travel) => {
        let sameId = travel === filteredTravel
        if (sameId){
            travel.passengersInfos.push(newPeople)
        }
    })
    fs.writeFile("./src/models/passengers.json", JSON.stringify(passengers), 'utf8', () => {})
    fs.writeFile("./src/models/travels.json", JSON.stringify(travels), 'utf8', function(err) {
        if (err) {
            res.status(500).send({
                "message": err
            })
        } else {
            // enviar a resposta pro postman
            res.status(201).send({ "message": "Passageiro adicionado à viagem com sucesso", filteredTravel });
        }
    });
}
const createDriver = (req, res) => { 
    
    let idreq = req.params.id;
    const { name, license} = req.body 

    let newDriver = {
        id: Math.random().toString(32).substr(2),
        name,
        license,
    }

    let filteredTravel = utils.findById(travels, idreq)

    travels.forEach((travels) => {
        let sameTravel = travels == filteredTravel
        if(sameTravel){
            travels.driverInfos = newDriver
        }
    })
    fs.writeFile("./src/models/travels.json", JSON.stringify(travels), 'utf8', function(err){
        if (err) {
            res.status(500).send ({
                "message": err
            })
        } else{
            res.status(200).send({ "message": "Motorista criado e adicionado  á viagem com sucesso",
            filteredTravel
            })
        }
    })
};

const updateDriver = (req, res) => { //atualizar qualquer dado do motorista
    let idDriver = req.params.id;
    let update =  req.body;

    //let filteredDriver = utils.findById(travel=> travel.driverInfos == idDriver)
    let filteredDriver = utils.findById(travels, idDriver)

    if(filteredDriver) {
        filteredDriver = update
    }
    // let keyList = Object.keys(update)

    // keyList.forEach((key) => {
    //     filteredDriver[key] = update[key]
    // })
    fs.writeFile("./src/models/travels.json", JSON.stringify(travels), 'utf8', function(err) {
        if (err) {
            res.status(500).send({
                "message": err
            })
        } else {
            // enviar a resposta pro postman
            res.status(201).send({ "message": "Informação do motorista alterada com sucesso", 
            filteredDriver });
        }
    });

}
const replaceDriver = (req, res) => { //substituir motorista
    const idDriver = req.params.id;
    const { 
        id,
        name,
        license
    } = req.body;

    let filteredTravel = utils.findById(travels, idDriver)
    const index = travels.indexOf(filteredTravel)

    let newDriver = {    
        id,
        name,
        license
    }
    if (index >= 0) {
        travels.splice(index, 1, newDriver) //tentar colocar o splice dentro do
        fs.writeFile("./src/models/travels.json", JSON.stringify(travels), 'utf8', function (err) {
            if (err) {
                res.status(500).send({ "message": err})
            }
            else{
                res.status(200).send({
                    "message": "Motorista substituido com sucesso.",
                    filteredTravel
                })
            }
        })
    } else {
        res.status(404).send({ "message": "Motorista não encontrado."})
    }
}

const deleteTravel = (req, res) => { //deletar uma viagem 
    const idRequerido = req.params.id;
    const filteredId = utils.findById(travels, idRequerido)

    const index = travels.indexOf(filteredId)
    
    if(index >=0 ){
        travels.splice(index, 1)

        fs.writeFile("./src/models/travels.json", JSON.stringify(travels), 'utf8', function(err) {
            if(err) {
                res.status(500).send({"message": err})
            }
            else{
                res.status(200).send({
                    "message": "Viagem deletada com sucesso",travels
                })
            }
        })
    }
}

module.exports = { getAllTravels, getAllTravelsOrder, getTravelById, createPassenger, createDriver, updateDriver, replaceDriver, deleteTravel }