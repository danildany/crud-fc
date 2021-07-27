
class Equipo {
    constructor(id, pais, nombre, logo, ubicacion, fundacion, fechaModificacion) {
      this.id = id;
      this.area = { name: pais };
      this.name = nombre;
      this.crestUrl = logo;
      this.address = ubicacion;
      this.founded = fundacion;
      this.lastUpdated = fechaModificacion;
    }
  }
  module.exports = Equipo;