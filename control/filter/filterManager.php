<?php
    header( "Content-type: application/json" );
    include "../bd/bdManager.php";
    include "../util/constantes.php";
    
    function obtenerDetalleAve(){
        $array = array();
        // Detalle del ave
        $array["ficha"] = cargarDetalleAve( $_POST[ "genero" ], $_POST[ "especie" ] );
        $array["ficha"] = array_map( "utf8_encode", $array["ficha"] );
        
        $array[ "ficha" ][ "imagenes" ] = scandir( "../../resources/images/aves/" .  $array[ "ficha" ][ "genero" ] . "_" .  $array[ "ficha" ][ "especie" ] );
            
        unset( $array[ "ficha" ][ "imagenes" ][0] );
        unset( $array[ "ficha" ][ "imagenes" ][1] );
        $array[ "ficha" ][ "imagenes" ] = array_values( $array[ "ficha" ][ "imagenes" ] );
        
        $encoded = json_encode( $array );

        // Respuesta
        die( $encoded );
    }
    
    function autocompletarAves(){
        $encoded = json_encode( cargarAutocompletarAves( $_GET[ "filtro" ] ) );
        
        // Respuesta
        die( $encoded );
    }
    
    function obtenerListaAvesFiltro(){
        $array = array();
        $arregloFiltro = array();
        
        $arregloFiltro = json_decode( json_encode( $_GET["filtro"] ) );
        
        $array = obtenerAvesFiltro( $arregloFiltro );
        
        
        // Se recorre la lista para organizar algunos textos
        foreach( $array as $indice => $arregloDatosAve ){
            $array[ $indice ] = array_map( "utf8_encode", $arregloDatosAve );
        }
        
        $encoded = json_encode( $array );

        // Respuesta
        die( $encoded );
    }
    
    
    if( empty( $_POST[ "metodo" ] ) ){
        $metodo = $_GET[ "metodo" ];
    }else{
        $metodo = $_POST[ "metodo" ];
    }
    $metodo();
?>
