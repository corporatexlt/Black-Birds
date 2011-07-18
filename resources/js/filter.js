var OBJETO_FILTROS = {};
var ACTUAL_TEMPORAL = "";
jQuery( function(){
    // Carga del contenido del modal
    jQuery( "#modalFichaCompleta" ).load( "ficha_completa.htm #contenedorFicha" );
    
    // Imagen de la galeria de fotografas
    Galleria.loadTheme( "../../resources/js/galleria/themes/classic/galleria.classic.min.js" );
    
    // Plugin para autocompletar las aves
    jQuery( "#busqueda" ).autocomplete( {
        minLenght: 2,
        source : function( request, response ){
            var lastXhr = jQuery.getJSON( "../../control/filter/filterManager.php", { filtro: request.term, metodo: "autocompletarAves" }, 
                function( data ) {
                    response( data );
                } 
            );
        }
    } );
    
    // Click al boton de busqueda del campo de texto
    jQuery( "#botonBuscar" ).click( function(){
        obtenerFichaTecnica( jQuery( "#busqueda" ).val().split( " " )[0] , jQuery( "#busqueda" ).val().split( " " )[1] )
    } );
    
    // Boton que busca con el filtro enviado
    jQuery( "#botonBuscarFiltro" ).click( function(){
        var arregloFiltros = [];
        for( var contador = 0; contador < jQuery( ".filtroSecundario:checked" ).length; contador ++ ){
            arregloFiltros[contador] = jQuery( ".filtroSecundario:checked" )[contador].value;
        }
        
        if( ACTUAL_TEMPORAL !== "" && arregloFiltros.length > 0 ){
            OBJETO_FILTROS[ACTUAL_TEMPORAL] = arregloFiltros;
            console.log(  OBJETO_FILTROS );
            var lastXhr = jQuery.getJSON( "../../control/filter/filterManager.php", { filtro: OBJETO_FILTROS, metodo: "obtenerListaAvesFiltro" }, 
                function( data ) {
                    // Se crea la tabla con los datos
                    dibujarTablaResultados( data );
                } 
            );
            
            jQuery( "#contenedorFiltroSecundario > *" ).remove();
            jQuery( "#filtrosIniciales" ).show();
        }
    } );
    
    // Boton que vuelve al inicio
    jQuery( "#botonVolver" ).click( function(){
        jQuery( "#contenedorFiltroSecundario > *" ).remove();
        jQuery( "#filtrosIniciales" ).show();
    } );
    
    // Limpia la lista de resultados
    textoSinResultados();
    
    // Carga los controles para los filtros
    cargarControlesFiltros();
} );

// Obtiene la información del ave según su género y especie
function obtenerFichaTecnica( genero, especie ){
    jQuery.ajax( {
        type: "POST", 
        url: "../../control/filter/filterManager.php", 
        dataType: "json", 
        data: {genero: genero, especie: especie, metodo: "obtenerDetalleAve"}, 
        success: function( data ){
            // Carga de la galeria
            cargarGaleriaImagenes( data );
            
            // Carga del mapa
            jQuery( "#worldMap" ).gmap( { 
                "center": ubicacionCoordenadas(), 
                "zoom": 7, 
                "callback": function () {
                    $( "#worldMap" ).gmap( "addMarker", {"position": ubicacionCoordenadas(), "title": "Taxi!"} );
                }
            } );
            
            // Llenado de la ficha
            llenarFicha( data );
            
            jQuery( "#modalFichaCompleta" ).dialog( {
                width: 1100,
                modal: true,
                position: "top",
                resizable: false
            } );
       },
       error: function( data ){
           alert( "error" );
       }
     } );
}

// Metodo de ubicacion de coordenadas
function ubicacionCoordenadas() {
    if ( google.loader.ClientLocation != null ) {
        return new google.maps.LatLng( google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude );	
    }
    return new google.maps.LatLng( 6.5759815, -75.8101578 );
}

// Funcion para el llenado de los datos de la ficha
function llenarFicha( data ){
    jQuery( "#orden" ).text( data.ficha.orden );
    jQuery( "#familia" ).text( data.ficha.familia );
    jQuery( "#nCientifico" ).text( data.ficha.genero + " " + data.ficha.especie );
    jQuery( "#nComun" ).text( data.ficha.nombreComun );
    jQuery( "#cConservacion" ).text( data.ficha.conservacion );
    jQuery( "#descripcion" ).text( data.ficha.descripcion );
    jQuery( "#dCuriosos" ).text( data.ficha.dCuriosos );
    
    jQuery( ".capital" ).removeClass( "capital" ).addClass( "capital" );
}

// Funcion para cuando no hay resultados de busqueda con el filtro ingresado, se usa para la carga inicial tambien
function textoSinResultados(){
    jQuery( ".contenedorListaFiltro > *" ).remove();
    jQuery( ".contenedorListaFiltro" ).html( "<div id='textoSinResultados' style='margin: 5px 0px 0px 5px; padding-top: 10px; font-weight: bold;'></div>" );
    jQuery( "#textoSinResultados" ).text( "No hay resultados para mostrar, por favor seleccione un filtro o corrija el filtro actual." );
}

// Dibuja los resultados de aves obtenidos por el filtro
function dibujarTablaResultados( objetoAves ){
    if( objetoAves && objetoAves.length > 0 ){
        jQuery( ".contenedorListaFiltro > *" ).remove();
        jQuery( ".contenedorListaFiltro" ).append( "<table>" );
        
        for( var contador = 0; contador < objetoAves.length; contador ++ ){
            jQuery( ".contenedorListaFiltro" ).append( "<tr>" );
            jQuery( ".contenedorListaFiltro" ).append( "<td class=\"col1\"><a href=\"javascript:void(0);\" onclick=\"obtenerFichaTecnica( '" + objetoAves[contador].genero + "', '" + objetoAves[contador].especie + "' )\" >" + objetoAves[contador].genero + " " + objetoAves[contador].especie + " - " + objetoAves[contador].nombreComun + "</a></td>" );
            jQuery( ".contenedorListaFiltro" ).append( "<td class= \"col2\">" + objetoAves[contador].facilidadVer +  "</td>" );
            jQuery( ".contenedorListaFiltro" ).append( "</tr>" );
        }
        jQuery( ".contenedorListaFiltro" ).append( "</table>");
    }else{
        textoSinResultados()
    }
}

function cargarGaleriaImagenes( datosAve ){
    jQuery( "#gallery > *" ).remove();
    
    for( var contador = 0; contador < datosAve.ficha.imagenes.length; contador ++ ){
        jQuery( "#gallery" ).append( "<img src='../../resources/images/aves/" + datosAve.ficha.genero + "_" + datosAve.ficha.especie + "/" + datosAve.ficha.imagenes[contador] + "' />" );
    }

    // Galleria de fotos
    jQuery( "#gallery" ).galleria( {
        width: 420,
        height: 360
    } );
}

// Manejo de la vista de los filtros principales
function cargarControlesFiltros(){
    jQuery( ".filtroPrincipal" ).click( function(){
        ACTUAL_TEMPORAL = this.id;
        // Oculta la tabla de filtros iniciales
        jQuery( "#filtrosIniciales" ).hide();
        
        jQuery( "#contenedorFiltroSecundario" ).load( "filtros/" + ACTUAL_TEMPORAL + ".html #filtro_" + ACTUAL_TEMPORAL );
    } );
}