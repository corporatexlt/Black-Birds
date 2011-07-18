<?php
// Encode the data.
$json = json_encode(
    array(
        1 => array(
            'English' => array(
                'One',
                'January'
            ),
            'French' => array(
                'Une',
                'Janvier'
            )
        )
    )
);

// Define the errors.
$constants = get_defined_constants(true);
$json_errors = array();
foreach ($constants["json"] as $name => $value) {
    if (!strncmp($name, "JSON_ERROR_", 11)) {
        $json_errors[$value] = $name;
    }
}

// Show the errors for different depths.
foreach (range(4, 3, -1) as $depth) {
    var_dump(json_decode($json, true, $depth));
    echo 'Last error: ', $json_errors[json_last_error()], PHP_EOL, PHP_EOL;
}
?>
