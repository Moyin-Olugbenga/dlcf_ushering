"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SetStateAction, useState, useTransition } from 'react';
import { submitAttendance } from './api/auth/attendance/attendance';
import { LOCATION, SERVICE } from "@/lib/generated/prisma/client";

export default function Home() {
  const [recordedBy, setRecordedBy] = useState('')
  const [location, setLocation] = useState('RELIGION_GROUND')
  const [serviceType, setServiceType] = useState('SWS')
  const [s_male, setStudentsMale] = useState(0)
  const [s_female, setStudentsFemale] = useState(0)
  const [ns_male, setNonStudentsMale] = useState(0)
  const [ns_female, setNonStudentsFemale] = useState(0)
  const [y_male, setYouthMale] = useState(0)
  const [y_female, setYouthFemale] = useState(0)
  const [ch_male, setChildrenMale] = useState(0)
  const [ch_female, setChildrenFemale] = useState(0)
  const [con_male, setConvertMale] = useState(0)
  const [con_female, setConvertFemale] = useState(0)
  const [nc_male, setNewcomersMale] = useState(0)
  const [nc_female, setNewcomersFemale] = useState(0);
  const [serviceDate, setServiceDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()

    formData.append('recordedBy', recordedBy)
    formData.append('location', location)
    formData.append('serviceType', serviceType)
    formData.append('s_male', s_male.toString())
    formData.append('s_female', s_female.toString())
    formData.append('ns_male', ns_male.toString())
    formData.append('ns_female', ns_female.toString())
    formData.append('y_male', y_male.toString())
    formData.append('y_female', y_female.toString())
    formData.append('ch_male', ch_male.toString())
    formData.append('ch_female', ch_female.toString())
    formData.append('con_male', con_male.toString())
    formData.append('con_female', con_female.toString())
    formData.append('nc_female', nc_female.toString())
    formData.append('nc_male', nc_male.toString())
    formData.append('serviceDate', serviceDate)

    startTransition(() => {
      submitAttendance(formData).then((res) => {
        if (res.success) {
          setSuccess(true)
          setErrors({})
        } else {
          setSuccess(false)
          setErrors(res.errors || {})
        }
      })
    })
  
  }

  return  (
    
  <div className="flex justify-center items-center ">
    <Card className="w-full max-w-sm my-10">
      <CardHeader>
        <CardTitle>Deeper Life Campus Fellowship</CardTitle>
        <CardDescription>
          Attendance report for the different locations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
               {errors && <p className="text-red-500 text-sm">{errors[0]}</p>}
      {success && <p className="text-green-600 text-sm mt-2">Attendance submitted successfully ✅</p>}
            
            <div className="grid gap-2">
              <Label><b>Recorded by?</b></Label>
             
             <div className="flex items-center"> 
                  <Input type="text" name="recorder" onChange={(e) => setRecordedBy(e.target.value)} />
              </div>
               {errors.recordedBy && <p className="text-red-500 text-sm">{errors.recordedBy[0]}</p>}

            </div>
         
            <div className="grid gap-2">
              <Label><b>Students(male first)</b></Label>
             
             <div className="flex space-x-4"> 
                  <Input type="number" placeholder="Male" value={s_male} onChange={(e) => setStudentsMale(Number(e.target.value))} />
                  <Input type="number" placeholder="Female" value={s_female} onChange={(e) => setStudentsFemale(Number(e.target.value))} />
              </div>
              {errors.s_male && <p className="text-red-500 text-sm">{errors.s_male[0]}</p>}
              {errors.s_female && <p className="text-red-500 text-sm">{errors.s_female[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label><b>Non Students(male first)</b></Label>
             
             <div className="flex space-x-4"> 
                  <Input type="number" placeholder="Male" value={ns_male} onChange={(e) => setNonStudentsMale(Number(e.target.value))} />
                  <Input type="number" placeholder="Female" value={ns_female} onChange={(e) => setNonStudentsFemale(Number(e.target.value))} />
              </div>
              {errors.ns_male && <p className="text-red-500 text-sm">{errors.ns_male[0]}</p>}
              {errors.ns_female && <p className="text-red-500 text-sm">{errors.ns_female[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label><b>Youth(male first)</b></Label>
             
             <div className="flex space-x-4"> 
                  <Input type="number" placeholder="Male" value={y_male} onChange={(e) => setYouthMale(Number(e.target.value))} />
                  <Input type="number" placeholder="Female" value={y_female} onChange={(e) => setYouthFemale(Number(e.target.value))} />
              </div>
              {errors.y_male && <p className="text-red-500 text-sm">{errors.y_male[0]}</p>}
              {errors.y_female && <p className="text-red-500 text-sm">{errors.y_female[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label><b>Children(male first)</b></Label>
             
             <div className="flex space-x-4"> 
                  <Input type="number" placeholder="Male" value={ch_male} onChange={(e) => setChildrenMale(Number(e.target.value))} />
                  <Input type="number" placeholder="Female" value={ch_female} onChange={(e) => setChildrenFemale(Number(e.target.value))} />
              </div>
              {errors.ch_male && <p className="text-red-500 text-sm">{errors.ch_male[0]}</p>}
              {errors.ch_female && <p className="text-red-500 text-sm">{errors.ch_female[0]}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label><b>Converts(male first)</b></Label>
             
             <div className="flex space-x-4"> 
                  <Input type="number" placeholder="Male" value={con_male} onChange={(e) => setConvertMale(Number(e.target.value))} />
                  <Input type="number" placeholder="Female" value={con_female} onChange={(e) => setConvertFemale(Number(e.target.value))} />
              </div>
              {errors.con_male && <p className="text-red-500 text-sm">{errors.con_male[0]}</p>}
              {errors.con_female && <p className="text-red-500 text-sm">{errors.con_female[0]}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label><b>Newcomers(male first)</b></Label>
             
             <div className="flex space-x-4"> 
                  <Input type="number" placeholder="Male" value={nc_male} onChange={(e) => setNewcomersMale(Number(e.target.value))} />
                  <Input type="number" placeholder="Female" value={nc_female} onChange={(e) => setNewcomersFemale(Number(e.target.value))} />
              </div>
              {errors.nc_male && <p className="text-red-500 text-sm">{errors.nc_male[0]}</p>}
              {errors.nc_female && <p className="text-red-500 text-sm">{errors.nc_female[0]}</p>}
            </div>
            
            <div className="grid gap-2">
                <Label htmlFor="">Service Date</Label>
              <div className="flex items-center">
                <Input type="date" name="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)}/>
              </div>
              {errors.serviceDate && <p className="text-red-500 text-sm">{errors.serviceDate[0]}</p>}
            </div>
            
            <div className="grid gap-2">
                <Label htmlFor="">Location</Label>
              <div className="flex items-center">
                <Select name="location"  value={location} onValueChange={(value: SetStateAction<string>) => setLocation(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value={LOCATION.RELIGION_GROUND}>Religion Ground</SelectItem>
                      <SelectItem value={LOCATION.EDE_ROAD}>Ede road</SelectItem>
                      <SelectItem value={LOCATION.DAMICO}>Damico</SelectItem>
                      <SelectItem value={LOCATION.KOIWO}>Koiwo</SelectItem>
                      <SelectItem value={LOCATION.URBAN_DAY}>Urban day</SelectItem>
                      <SelectItem value={LOCATION.ELEYELE}>Eleyele</SelectItem>
                      <SelectItem value={LOCATION.AJEBAMIDELE}>Ajebamidele</SelectItem>
                      <SelectItem value={LOCATION.ROAD7}>Road 7</SelectItem>
                      <SelectItem value={LOCATION.QUARTERS}>Quarters</SelectItem>
                      <SelectItem value={LOCATION.PG}>PG</SelectItem>
                      <SelectItem value={LOCATION.MOREMI}>Moremi Estate</SelectItem>
                      <SelectItem value={LOCATION.CORPERS}>Corpers</SelectItem>
                      <SelectItem value={LOCATION.IJEDU}>Ijedu</SelectItem>
                      <SelectItem value={LOCATION.OAU_THC}>OAUTHC</SelectItem>
                      <SelectItem value={LOCATION.CDL}>CDL</SelectItem>
                      <SelectItem value={LOCATION.OMOLE}>Omole</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.location && <p className="text-red-500 text-sm">{errors.location[0]}</p>}
            </div>
            
            <div className="grid gap-2">
                <Label htmlFor="">Service</Label>
              <div className="flex items-center">
                <Select name="service" value={serviceType} onValueChange={(value: SetStateAction<string>) => setServiceType(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the Service Day" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value={SERVICE.SWS}>Sunday Worship Service</SelectItem>
                      <SelectItem value={SERVICE.MBS}>Monday Bible Study</SelectItem>
                      <SelectItem value={SERVICE.SWM}>Saturday Workers Meeting</SelectItem>
                      <SelectItem value={SERVICE.TRH}>Thursday Revival Hour</SelectItem>
                      <SelectItem value={SERVICE.GCK_DAY1}>GCK Day 1</SelectItem>
                      <SelectItem value={SERVICE.GCK_DAY2}>GCK Day 2</SelectItem>
                      <SelectItem value={SERVICE.GCK_DAY3}>GCK Day 3</SelectItem>
                      <SelectItem value={SERVICE.GCK_DAY4}>GCK Day 4</SelectItem>
                      <SelectItem value={SERVICE.GCK_DAY5}>GCK Day 5</SelectItem>
                      <SelectItem value={SERVICE.GCK_DAY6}>GCK Day 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.serviceType && <p className="text-red-500 text-sm">{errors.serviceType[0]}</p>}
            </div>

          </div>
          <div  className="flex-col gap-2"> 
            <Button variant="outline" type="submit" disabled={isPending} style={{ marginTop: '1.5rem' }}>
              {isPending ? 'Submitting...' : 'Submit Attendance'}
            </Button>
          </div>
           
        </form>
        <CardAction>
        </CardAction>
      </CardContent>
    </Card>
    </div>
  )
}
