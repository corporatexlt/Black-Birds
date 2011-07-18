<?php

include "../util/constantes.php";

/**
 * Obtiene el detalle de un ave a partir de su genero y especie
 * 
 * @param type $generoAve : genero del ave a buscar
 * @param type $especieAve : especie del ave a buscar
 */
function cargarDetalleAve($generoAve, $especieAve) {
    $con = mysqli_connect("localhost", "root", "", "negrito");
    if (!$con) {
        exit("Connect Error (" . mysqli_connect_errno() . ") " . mysqli_connect_error());
    }

    //set the default client character set 
    mysqli_set_charset($con, "utf-8");
    //mysqli_select_db( $con, "eqprodu_beto" );

    $retorno = array();

    $sqlQuery = sprintf("SELECT av.genero, av.especie, av.orden, av.familia, av.conservacion, av.nombreComun, av.descripcion FROM aves av WHERE av.genero = '%s' AND av.especie = '%s' ", mysqli_real_escape_string($con, $generoAve), mysqli_real_escape_string($con, $especieAve));

    $wisher = mysqli_query($con, $sqlQuery);

    while ($row = mysqli_fetch_assoc($wisher)) {
        $retorno = $row;
    }

    return $retorno;
}

/**
 * Obtiene el nombre cientifico del ave a partir de un filtro
 * 
 * @param type $filtro : texto a usar como filtro
 */
function cargarAutocompletarAves($filtro) {
    $con = mysqli_connect("localhost", "root", "", "negrito");
    if (!$con) {
        exit("Connect Error (" . mysqli_connect_errno() . ") " . mysqli_connect_error());
    }

    //set the default client character set 
    mysqli_set_charset($con, "utf-8");
    //mysqli_select_db( $con, "eqprodu_beto" );

    $retorno = array();

    $sqlQuery = sprintf("SELECT CONCAT( av.genero, ' ', av.especie  ) FROM aves av WHERE av.genero LIKE '%s' OR av.especie LIKE '%s'", "%" . mysqli_real_escape_string($con, $filtro) . "%", "%" . mysqli_real_escape_string($con, $filtro) . "%");

    $wisher = mysqli_query($con, $sqlQuery);

    while ($row = mysqli_fetch_array($wisher)) {
        array_push($retorno, $row[0]);
    }

    return $retorno;
}

function obtenerAvesFiltro( $arregloFiltro ) {
    $con = mysqli_connect("localhost", "root", "", "negrito");
    if (!$con) {
        exit("Connect Error (" . mysqli_connect_errno() . ") " . mysqli_connect_error());
    }

    $sqlQuery = "SELECT av.genero, av.especie, av.nombreComun, av.facilidadVer FROM aves av WHERE ";
    $and = false;
    //set the default client character set 
    mysqli_set_charset($con, "utf-8");

    $retorno = array();
    
    foreach ($arregloFiltro as $nombreFiltro => $valores) {
        if ($and) {
            $sqlQuery = $sqlQuery . " AND av." . $nombreFiltro . " REGEXP '" . implode("{1}|", $valores) . "{1}'";
        } else {
            $sqlQuery = $sqlQuery . "av." . $nombreFiltro . " REGEXP '" . implode("{1}|", $valores) . "{1}'";
        }

        $and = true;
    }
    $sqlQuery = sprintf( $sqlQuery );

    $wisher = mysqli_query($con, $sqlQuery);

    while ( $row = mysqli_fetch_assoc($wisher) ) {
        array_push( $retorno, $row );
    }

    return $retorno;
}

?>
