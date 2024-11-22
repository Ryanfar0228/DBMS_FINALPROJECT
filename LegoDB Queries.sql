-- Initializing --
CREATE DATABASE legodb;
USE legodb;

-- ---------------------+
-- Constraints and Keys |
-- ---------------------+

-- colors Constraints and Keys
ALTER TABLE colors 
CHANGE COLUMN id color_id INT;
ALTER TABLE colors
ADD PRIMARY KEY (color_id);


-- inventories_abbrev Constraint and Keys
ALTER TABLE inventories_abbrev
ADD PRIMARY KEY (inventory_id);
ALTER TABLE inventories_abbrev 
MODIFY COLUMN set_num VARCHAR(100);
ALTER TABLE inventories_abbrev
ADD FOREIGN KEY (set_num) REFERENCES sets_abbrev(set_num); 

-- inventory_parts_abbrev Constraints and Keys
ALTER TABLE inventory_parts_abbrev
ADD FOREIGN KEY (inventory_id) REFERENCES inventories_abbrev(inventory_id); 
ALTER TABLE inventory_parts_abbrev 
MODIFY COLUMN part_num VARCHAR(100);
ALTER TABLE inventory_parts_abbrev
ADD FOREIGN KEY (part_num) REFERENCES parts(part_num); -- Issues exist here
ALTER TABLE inventory_parts_abbrev
ADD FOREIGN KEY (color_id) REFERENCES colors(color_id);

-- inventory_sets Constraints and Keys
ALTER TABLE inventory_sets 
MODIFY COLUMN set_num VARCHAR(100);
ALTER TABLE inventory_sets
ADD FOREIGN KEY (set_num) REFERENCES sets_abbrev(set_num); -- Issues exist here
ALTER TABLE inventory_sets
ADD FOREIGN KEY (inventory_id) REFERENCES inventories_abbrev(inventory_id); -- Issues exist here

-- part_categories Constraints and Keys
ALTER TABLE part_categories 
CHANGE COLUMN id part_cat_id INT;
ALTER TABLE part_categories
ADD PRIMARY KEY (part_cat_id);

-- parts Constraints and Keys
ALTER TABLE parts 
MODIFY COLUMN part_num VARCHAR(100);
ALTER TABLE parts
ADD PRIMARY KEY (part_num);
ALTER TABLE parts
ADD FOREIGN KEY (part_cat_id) REFERENCES part_categories(part_cat_id); 

-- sets_abbrev Constraints and Keys
ALTER TABLE sets_abbrev 
MODIFY COLUMN set_num VARCHAR(100);
ALTER TABLE sets_abbrev
ADD PRIMARY KEY (set_num);
ALTER TABLE sets_abbrev
ADD FOREIGN KEY (theme_id) REFERENCES themes(theme_id);

-- themes Constraints and Keys
ALTER TABLE themes 
CHANGE COLUMN id theme_id INT;
ALTER TABLE themes
ADD PRIMARY KEY (theme_id);

-- ---------------------+
-- SQL Operations       |
-- ---------------------+

-- creating set
CREATE TABLE "set_name" ( -- <--------------------------------------------------------------------VARIABLE
	part_num VARCHAR(255),
    name VARCHAR(255),
    quantity INT
    ADD FOREIGN KEY (part_num) REFERENCES parts(part_num); 
);

-- deleting set
DROP TABLE "set_name" -- <--------------------------------------------------------------------VARIABLE

-- updating set
INSERT INTO "set_name" (part_num, name, quantity)
VALUES ("part_num", "name", "quantity"); -- <--------------------------------------------------------------------VARIABLE

-- searching for specific part
SELECT * FROM parts 
WHERE part_num LIKE '%part_num%' -- <--------------------------------------------------------------------VARIABLE
OR
name LIKE '%part_name%'; -- <--------------------------------------------------------------------VARIABLE

-- searching for specific set with list of parts
SELECT sa.set_num, sa.name, p.part_num, p.name
FROM sets_abbrev AS sa JOIN inventories_abbrev AS ia ON ia.set_num = sa.set_num
					             JOIN inventory_parts_abbrev AS ip ON ip.inventory_id = ia.inventory_id
                       JOIN parts AS p ON p.part_num = ip.part_num
WHERE sa.name LIKE '%set_name%'; -- <--------------------------------------------------------------------VARIABLE
