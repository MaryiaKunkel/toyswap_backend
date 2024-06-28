INSERT INTO users (username, password, first_name, last_name, email)
VALUES ('john_doe', 
        'password123', 
        'John', 
        'Doe', 
        'john.doe@example.com'),
        ('jane_smith', 
        'password456', 
        'Jane', 
        'Smith', 
        'jane.smith@example.com'),
        ('alice_johnson', 
        'password789', 
        'Alice', 
        'Johnson', 
        'alice.johnson@example.com');

INSERT INTO address (state, city)
VALUES ('Wisconsin', 
        'Sussex'),
        ('Wisconsin', 
        'Milwaukee'),
        ('Wisconsin',
        'Waukesha');

INSERT INTO listing (title, description, image_url, available, shared_by_username, address_id)
VALUES ('Toy Car', 'A small toy car', 
        
        'https://t4.ftcdn.net/jpg/02/35/70/21/360_F_235702111_KkocG4AsR4dHy97wo8eQscrn4bKOXT4i.jpg', 
        TRUE, 
        'john_doe',
        1),
        ('Teddy Bear', 
        'A soft teddy bear', 
        
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhBcblX20dugxRRgB8TZwt57a8VseIdBkE3w&s', 
        TRUE, 
        'jane_smith',
        2),
        ('Lego Set', 
        'A set of Lego bricks', 
        
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Irht59o5nS8MKMVngzsIeA_8saWe9Yvstw&s', 
        TRUE, 
        'alice_johnson',
        3);



INSERT INTO liked_listing (listing_id,username) 
VALUES (1,'alice_johnson'),
        (2, 'john_doe');

INSERT INTO review (reviewer_username, reviewed_username, review_text, review_date) 
VALUES ('john_doe', 'jane_smith', 'Great seller!', '2023-01-01'),
        ('jane_smith', 'alice_johnson', 'Fast shipping!', '2023-01-02'),
        ('alice_johnson', 'john_doe', 'Item as described.', '2023-01-03');

