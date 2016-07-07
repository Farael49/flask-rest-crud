
def copy_not_null(fromA, toB):
    if type(fromA) is type(toB):
        for k, v in fromA.__class__.__dict__.items():
            if v is not None:
                setattr(toB, k.name, v)
            else:
                print(k + ' property is ' + v)
