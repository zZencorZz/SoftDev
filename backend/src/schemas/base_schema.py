from pydantic import BaseModel

class BaseSchema(BaseModel):

    def clean_dict(self) -> dict:
        return self.model_dump(exclude_none=True)
    
    model_config = {
        "from_attributes": True
    }