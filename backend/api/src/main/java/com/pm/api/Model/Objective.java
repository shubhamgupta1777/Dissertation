package com.pm.api.Model;

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
@Document(collection = "objectives")
public class Objective {

    @Id
    private ObjectId id;
    private String name;
    private String description;
    private Status status;
    private int progress;

    @DocumentReference
    private List<Deliverable> deliverables;

}
