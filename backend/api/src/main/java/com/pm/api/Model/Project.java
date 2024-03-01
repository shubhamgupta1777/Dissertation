package com.pm.api.Model;

import java.sql.Date;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "projects")
public class Project {

    @Id
    private ObjectId id;
    private String name;
    private String description;
    private Date startDate;
    private Date deadLine;
    private Status status;
    private int progress;

    @DocumentReference
    private List<User> users;

    @DocumentReference
    private List<Objective> objectives;

    

}
