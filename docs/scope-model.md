# Scope model

Required scopes are requested at installation. Optional scopes are requested dynamically and may be declined, so an optional declaration is not evidence that a required webhook scope is available. For the two mapped webhook topics, the analyzer recognises the documented `write_products` → `read_products` and `write_orders` → `read_orders` implications already used by the scope model; this webhook mapping adds no other write/read implications. The analyzer does not infer actual merchant grants.

For mapped classic webhook topics, EVIDENCED means at least one documented required-scope alternative is declared as required or satisfied by a documented implication. NOT EVIDENCED means no required alternative is declared, including when an alternative appears only under `optional_scopes`. UNKNOWN means the topic or webhook API version is outside the evidence registry; it does not mean the webhook needs no scope.
